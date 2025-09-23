
# Bank of the Republic of Colombia MCP Server

This project implements a Model Context Protocol (MCP) server for the Bank of the Republic of Colombia. MCP is an open protocol for connecting AI models and tools, enabling secure, flexible, and remote access to custom tools and data sources.

## Project Overview

- **Purpose:** Provide a remote MCP server for accessing Colombian inflation data and related tools.
- **Platform:** Built to run on Cloudflare Workers for scalability and low-latency global access.
- **Features:**
  - Exposes inflation data and analytics tools via MCP
  - Designed for integration with Claude Desktop and other MCP clients
  - Easily extendable with new tools and endpoints

## Usage

You can connect to this MCP server from local or remote MCP clients, including Claude Desktop, to access Colombian inflation data and other tools provided by the server.

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote).

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"  // or remote-mcp-server.com/sse
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available.
