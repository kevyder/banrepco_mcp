import { PaginationSchema } from "../schemas/common.js";
import { InflationMonthYearSchema, InflationDateRangeSchema } from "../schemas/inflation.js";
import { InflationType, PaginatedInflationType, InflationErrorResponseType } from "../types.js";
import { BaseTool } from "./tool.interface.js";

export class InflationTool extends BaseTool {
    protected initTools(): void {
        this.server.tool(
            "get_inflation_data",
            PaginationSchema,
            async ({ page = 1, sizePerPage = 50, sort = "asc" }) => {
                const data = await this.httpClient.get<InflationType | PaginatedInflationType | InflationErrorResponseType>(
                    `/inflation?page=${page}&size=${sizePerPage}&sort=${sort}`
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );

        this.server.tool(
            "get_inflation_data_by_specific_month",
            InflationMonthYearSchema,
            async ({ month, year }) => {
                const data = await this.httpClient.get<InflationType | InflationErrorResponseType>(
                    `/inflation/${year}/${month}`
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );

        this.server.tool(
            "get_inflation_data_by_range_dates",
            InflationDateRangeSchema,
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

                const data = await this.httpClient.get<PaginatedInflationType | InflationErrorResponseType>(
                    `/inflation/date-range?${params.toString()}`
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }],
                };
            }
        );
    }
}