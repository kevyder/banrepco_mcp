
# Bank of the Republic of Colombia MCP Server

This project implements a Model Context Protocol (MCP) server for the Bank of the Republic of Colombia. MCP is an open protocol for connecting AI models and tools, enabling secure, flexible, and remote access to custom tools and data sources.

## Project Overview

- **Purpose:** Provide a remote MCP server for accessing Colombian financial indicators and related tools.
- **Platform:** Built to run on Cloudflare Workers for scalability and low-latency global access.
- **Features:**
  - Exposes inflation data and analytics tools via MCP
  - Provides access to TRM (Tasa Representativa del Mercado) exchange rates
  - Designed for integration with Claude Desktop and other MCP clients
  - Easily extendable with new tools and endpoints

## Available Tools

### Inflation Data Tools
- `get_inflation_data`: Retrieve paginated inflation data
- `get_inflation_data_by_specific_month`: Get inflation data for a specific month and year
- `get_inflation_data_by_range_dates`: Query inflation data within a date range

### TRM (Exchange Rate) Tools
- `get_usd_to_cop_trm_historical_data`: Retrieve historical USD to COP exchange rates with pagination
- `get_usd_to_cop_trm_by_date_range`: Query TRM data between two specific dates
- `get_usd_to_cop_trm_by_date`: Get the TRM value for a specific date

Each tool supports pagination and sorting options where applicable. The TRM (Tasa Representativa del Mercado) represents the official USD to COP exchange rate.

## Usage

You can connect to this MCP server from local or remote MCP clients, including Claude Desktop, to access Colombian financial indicators and market data. The tools provide access to both historical and current data for inflation rates and the Market Representative Rate (TRM).

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote).

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "banrepco": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://mcp.banrepco.kevyder.dev/sse"  // or remote-mcp-server.com/sse
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available.
