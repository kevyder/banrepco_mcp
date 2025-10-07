import { z } from "zod";

import { InflationSchema, PaginatedInflationSchema } from "./schemas/inflation.js";

const InflationErrorResponse = z.object({ error: z.string() })

export type InflationType = z.infer<typeof InflationSchema>
export type PaginatedInflationType = z.infer<typeof PaginatedInflationSchema>;
export type InflationErrorResponseType = z.infer<typeof InflationErrorResponse>