import { z } from "zod";

// Validation schemas
const PaginationSchema = {
  page: z.number().int().min(1).default(1),
  sizePerPage: z.number().int().min(1).max(100).default(50),
  sort: z.enum(["asc", "desc"]).default("desc"),
};

export { PaginationSchema };