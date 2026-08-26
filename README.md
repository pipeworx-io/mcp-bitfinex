# @pipeworx/bitfinex

[Bitfinex](https://docs.bitfinex.com/docs) MCP — keyless public market endpoints (v2 API).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `tickers(symbols)` — multi-symbol tickers (comma-sep: `tBTCUSD,tETHUSD` or `ALL`)
- `ticker(symbol)` — single ticker (e.g. `tBTCUSD`)
- `ticker_history(symbols, limit?, start?, end?)` — historical tickers
- `trades(symbol, limit?, start?, end?, sort?)` — recent trades
- `book(symbol, precision?, length?)` — orderbook (precision `P0|P1|P2|P3|R0`)
- `stats(key, symbol, side?, section?, sort?, start?, end?, limit?)` — statistics (e.g. `pos.size:1m:tBTCUSD:long`)
- `candles(timeframe, symbol, section, limit?, start?, end?, sort?)` — OHLC (timeframe `1m|5m|15m|30m|1h|3h|6h|12h|1D|1W|14D|1M`; section `last|hist`)
- `derivatives_status(keys?)` — perpetual contract status
- `derivatives_status_history(key, limit?, start?, end?, sort?)` — historical derivatives status
- `liquidations(start?, end?, limit?, sort?)` — recent liquidations
- `platform_status()` — platform status

## Data source

`https://api-pub.bitfinex.com/v2`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bitfinex": {
      "url": "https://gateway.pipeworx.io/bitfinex/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/bitfinex/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Bitfinex data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
