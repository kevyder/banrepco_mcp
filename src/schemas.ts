import { z } from "zod";

// Validation schemas
const PaginationSchema = {
  page: z.number().int().min(1).default(1),
  sizePerPage: z.number().int().min(1).max(100).default(50),
  sort: z.enum(["asc", "desc"]).default("desc"),
};

const MonthYearSchema = {
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1957).max(new Date().getFullYear()),
};

const DateRangeSchema = {
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int().min(1957).max(new Date().getFullYear()),
  endMonth: z.number().int().min(1).max(12),
  endYear: z.number().int().min(1957).max(new Date().getFullYear()),
  ...PaginationSchema,
};

const InflationSchema = z.object({
  year: z.number().int().min(1957).max(new Date().getFullYear()),
  month: z.number().int().min(1).max(12),
  annual_inflation_rate: z.number(),
  target: z.number().optional(),
})

const PaginatedInflationSchema = z.object({
  items: z.array(InflationSchema),
  total: z.number().int(),
  page: z.number().int(),
  size: z.number().int(),
});

export { PaginationSchema, MonthYearSchema, DateRangeSchema, InflationSchema, PaginatedInflationSchema };