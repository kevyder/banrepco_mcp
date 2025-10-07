import { z } from "zod";
import { PaginationSchema } from "./common.js";

const InflationMonthYearSchema = {
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1957),
};

const InflationDateRangeSchema = {
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int().min(1957),
  endMonth: z.number().int().min(1).max(12),
  endYear: z.number().int().min(1957),
  ...PaginationSchema,
};

const InflationSchema = z.object({
  year: z.number().int().min(1957),
  month: z.number().int().min(1).max(12),
  annual_inflation_rate: z.number(),
  target: z.number().nullable(),
})

const PaginatedInflationSchema = z.object({
  items: z.array(InflationSchema),
  total: z.number().int(),
  page: z.number().int(),
  size: z.number().int(),
});

export { InflationMonthYearSchema, InflationDateRangeSchema, InflationSchema, PaginatedInflationSchema };