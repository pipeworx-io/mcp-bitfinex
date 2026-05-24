# mcp-bitfinex

Bitfinex v2 public MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `ticker_history` | Historical tickers. |
| `trades` | Recent trades. |
| `book` | Orderbook. |
| `stats` | Statistics by key. |
| `candles` | OHLC candles. |
| `derivatives_status_history` | Historical derivatives status. |
| `liquidations` | Recent liquidations. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
