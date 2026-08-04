# @pipeworx/bitfinex

[Bitfinex](https://docs.bitfinex.com/docs) MCP — keyless public market endpoints (v2 API).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bitfinex data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
