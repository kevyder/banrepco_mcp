import { PaginationSchema } from "../schemas/common.js";
import { TRMDateRangeSchema, TRMByDate } from "../schemas/trm.js";
import { BaseTool } from "./tool.interface.js";

interface TrmResponse {
    value: number;
    date: string;
}

interface PaginatedTrmResponse {
    items: TrmResponse[];
    total: number;
    page: number;
    size: number;
}

type TrmErrorResponse = {
    error: string;
}

export class TrmTool extends BaseTool {
    protected initTools(): void {
        this.server.tool(
            "get_usd_to_cop_trm_historical_data",
            PaginationSchema,
            async ({ page = 1, sizePerPage = 50, sort = "asc" }) => {
                const data = await this.httpClient.get<TrmResponse | TrmErrorResponse>(
                    `/trm?page=${page}&size=${sizePerPage}&sort=${sort}`
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );

        this.server.tool(
            "get_usd_to_cop_trm_by_date_range",
            TRMDateRangeSchema,
            async ({ startDate, endDate, page, sizePerPage, sort }) => {
                const params = new URLSearchParams({
                    start_date: startDate.toString(),
                    end_date: endDate.toString(),
                    sort,
                    page: page.toString(),
                    size: sizePerPage.toString(),
                });

                const data = await this.httpClient.get<PaginatedTrmResponse | TrmErrorResponse>(
                    `/trm/by-date-range?${params.toString()}`
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );

        this.server.tool(
            "get_usd_to_cop_trm_by_date",
            TRMByDate,
            async ({ date }) => {
                const data = await this.httpClient.get<TrmResponse | TrmErrorResponse>(
                    `/trm/by-date?specific_date=${date}`
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );
    }
}