import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { PaginationSchema, MonthYearSchema, DateRangeSchema, InflationSchema, PaginatedInflationSchema } from "./schemas.js";
import { InflationType, PaginatedInflationType, InflationErrorResponseType } from "./types.js"


export class BanrepcoMCP extends McpAgent {
	server = new McpServer({
		name: "Bank of the Republic of Colombia MCP Agent",
		version: "1.0.0",
	});
	baseURL = env.BAN_REP_CO_API_URL

	private async makeGetRequest(url: string): Promise<InflationType | PaginatedInflationType | InflationErrorResponseType>{
		try {
			const response = await fetch(url, {
				headers: {
					'Accept': 'application/json',
					'User-Agent': 'BanrepcoMCP/1.0.0'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data: JSON = await response.json();

			if ("items" in data) {
				return await PaginatedInflationSchema.parseAsync(data);
			}

			return await InflationSchema.parseAsync(data)

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('API request failed:', errorMessage);
			return {error: `Failed to fetch data: ${errorMessage}`};
		}
	}

	async init() {
		this.server.tool(
			"get_inflation_data",
			PaginationSchema,
			async ({ page = 1, sizePerPage = 50, sort = "asc" }) => {
				const url = `${this.baseURL}/inflation?page=${page}&size=${sizePerPage}&sort=${sort}`;
				const data = await this.makeGetRequest(url);
				return {
					content: [{ type: "text", text: JSON.stringify(data) }],
				};
			}
		);
		this.server.tool(
			"get_inflation_data_by_specific_month",
			MonthYearSchema,
			async ({ month, year }) => {
				const url = `${this.baseURL}/inflation/${year}/${month}`;
				const data = await this.makeGetRequest(url);
				return {
					content: [{ type: "text", text: JSON.stringify(data) }],
				};
			}
		);
		this.server.tool(
			"get_inflation_data_by_range_dates",
			DateRangeSchema,
			async ({ startMonth, startYear, endMonth, endYear, page, sizePerPage, sort }) => {

				const params = new URLSearchParams({
					start_year: startYear.toString(),
					start_month: startMonth.toString(),
					end_year: endYear.toString(),
					end_month: endMonth.toString(),
					sort,
					page: page.toString(),
					size: sizePerPage.toString(),
				});

				const url = `${this.baseURL}/inflation/date-range?${params.toString()}`;
				const data = await this.makeGetRequest(url);
				return {
					content: [{ type: "text", text: JSON.stringify(data) }],
				};
			}
		);
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