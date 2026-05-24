interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Bitfinex v2 public MCP.
 */


const BASE = 'https://api-pub.bitfinex.com/v2';
const UA = 'pipeworx-mcp-bitfinex/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'tickers', description: 'Multi-symbol tickers (e.g. "tBTCUSD,tETHUSD" or "ALL").', inputSchema: { type: 'object', properties: { symbols: { type: 'string' } }, required: ['symbols'] } },
  { name: 'ticker', description: 'Single ticker.', inputSchema: { type: 'object', properties: { symbol: { type: 'string' } }, required: ['symbol'] } },
  {
    name: 'ticker_history',
    description: 'Historical tickers.',
    inputSchema: { type: 'object', properties: { symbols: { type: 'string' }, limit: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' } }, required: ['symbols'] },
  },
  {
    name: 'trades',
    description: 'Recent trades.',
    inputSchema: { type: 'object', properties: { symbol: { type: 'string' }, limit: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' }, sort: { type: 'number' } }, required: ['symbol'] },
  },
  {
    name: 'book',
    description: 'Orderbook.',
    inputSchema: { type: 'object', properties: { symbol: { type: 'string' }, precision: { type: 'string' }, length: { type: 'number' } }, required: ['symbol'] },
  },
  {
    name: 'stats',
    description: 'Statistics by key.',
    inputSchema: {
      type: 'object',
      properties: { key: { type: 'string' }, symbol: { type: 'string' }, side: { type: 'string' }, section: { type: 'string' }, sort: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' }, limit: { type: 'number' } },
      required: ['key', 'symbol'],
    },
  },
  {
    name: 'candles',
    description: 'OHLC candles.',
    inputSchema: {
      type: 'object',
      properties: { timeframe: { type: 'string' }, symbol: { type: 'string' }, section: { type: 'string' }, limit: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' }, sort: { type: 'number' } },
      required: ['timeframe', 'symbol', 'section'],
    },
  },
  { name: 'derivatives_status', description: 'Perpetual contract status.', inputSchema: { type: 'object', properties: { keys: { type: 'string' } } } },
  {
    name: 'derivatives_status_history',
    description: 'Historical derivatives status.',
    inputSchema: { type: 'object', properties: { key: { type: 'string' }, limit: { type: 'number' }, start: { type: 'number' }, end: { type: 'number' }, sort: { type: 'number' } }, required: ['key'] },
  },
  {
    name: 'liquidations',
    description: 'Recent liquidations.',
    inputSchema: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' }, limit: { type: 'number' }, sort: { type: 'number' } } },
  },
  { name: 'platform_status', description: 'Platform status.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Bitfinex: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'tickers':
      return get(`/tickers`, { symbols: reqStr('symbols', '"tBTCUSD,tETHUSD"') });
    case 'ticker':
      return get(`/ticker/${encodeURIComponent(reqStr('symbol', '"tBTCUSD"'))}`);
    case 'ticker_history':
      return get(`/tickers/hist`, { symbols: reqStr('symbols', '"tBTCUSD"'), limit: args.limit, start: args.start, end: args.end });
    case 'trades':
      return get(`/trades/${encodeURIComponent(reqStr('symbol', '"tBTCUSD"'))}/hist`, { limit: args.limit, start: args.start, end: args.end, sort: args.sort });
    case 'book':
      return get(`/book/${encodeURIComponent(reqStr('symbol', '"tBTCUSD"'))}/${String(args.precision ?? 'P0')}`, { len: args.length });
    case 'stats': {
      const key = reqStr('key', '"pos.size:1m"');
      const symbol = reqStr('symbol', '"tBTCUSD"');
      const side = args.side ? `:${args.side}` : '';
      const section = String(args.section ?? 'hist');
      return get(`/stats1/${encodeURIComponent(key)}:${encodeURIComponent(symbol)}${side}/${encodeURIComponent(section)}`, {
        sort: args.sort,
        start: args.start,
        end: args.end,
        limit: args.limit,
      });
    }
    case 'candles': {
      const tf = encodeURIComponent(reqStr('timeframe', '"1h"'));
      const sym = encodeURIComponent(reqStr('symbol', '"tBTCUSD"'));
      const section = encodeURIComponent(reqStr('section', '"hist"'));
      return get(`/candles/trade:${tf}:${sym}/${section}`, { limit: args.limit, start: args.start, end: args.end, sort: args.sort });
    }
    case 'derivatives_status':
      return get('/status/deriv', { keys: args.keys ?? 'ALL' });
    case 'derivatives_status_history':
      return get(`/status/deriv/${encodeURIComponent(reqStr('key', '"tBTCF0:USTF0"'))}/hist`, { limit: args.limit, start: args.start, end: args.end, sort: args.sort });
    case 'liquidations':
      return get('/liquidations/hist', { start: args.start, end: args.end, limit: args.limit, sort: args.sort });
    case 'platform_status':
      return get('/platform/status');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
