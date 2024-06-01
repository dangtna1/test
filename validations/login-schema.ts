import { z } from "zod";

/* -----------------------------------------------------------------------------
 * Login Schema
 * -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  address: z.string(),
  signature: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
