import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { HttpClient } from "./utils/http-client.js";
import { InflationTool } from "./tools/inflation.js";
import { TrmTool } from "./tools/trm.js";

export class BanrepcoMCP extends McpAgent {
	server = new McpServer({
		name: "Bank of the Republic of Colombia MCP Agent",
		version: "1.1.0",
	});
	private readonly httpClient: HttpClient;
	private readonly inflationTool: InflationTool;
	private readonly trmTool: TrmTool;

	constructor(state: DurableObjectState, env: Env) {
		super(state, env);
		this.httpClient = new HttpClient(env.BAN_REP_CO_API_URL);
		this.inflationTool = new InflationTool(this.server, this.httpClient);
		this.trmTool = new TrmTool(this.server, this.httpClient);
	}

	async init() {
		this.inflationTool.start();
		this.trmTool.start();
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return BanrepcoMCP.serveSSE("/sse").fetch(request, env, ctx);
		}
		if (url.pathname === "/mcp") {
			return BanrepcoMCP.serve("/mcp").fetch(request, env, ctx);
		}
		return new Response("Not found", { status: 404 });
	},
};