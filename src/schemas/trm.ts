import { z } from "zod";
import { PaginationSchema } from "./common.js";

const TRMDateRangeSchema = {
  startDate: z.string().date(),
  endDate: z.string().date(),
  ...PaginationSchema,
};

const TRMByDate = {
  date: z.string().date(),
}

export { TRMDateRangeSchema, TRMByDate };