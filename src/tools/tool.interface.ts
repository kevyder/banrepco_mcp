import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HttpClient } from "../utils/http-client.js";

export interface Tool {
    /**
     * Starts the tool by initializing and registering all MCP tools
     */
    start(): void;
}

export abstract class BaseTool implements Tool {
    constructor(
        protected readonly server: McpServer,
        protected readonly httpClient: HttpClient
    ) {}

    /**
     * Starts the tool by initializing all MCP tools
     */
    public start(): void {
        this.initTools();
    }

    /**
     * Initialize and register the tools with the MCP server
     * @protected This method should only be called by the start() method
     */
    protected abstract initTools(): void;
}