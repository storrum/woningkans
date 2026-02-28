import { z } from "zod";

export const biedStrategieSchema = z.object({
  bovenVraagprijs: z.boolean(),
  zonderFinancieringsvoorbehoud: z.boolean(),
  flexibeleOpleverdatum: z.boolean(),
  snelleOverdracht: z.boolean(),
  aankoopmakelaar: z.boolean(),
  voorbehoudKeuring: z.boolean(),
  voorbehoudVerkoop: z.boolean(),
});

export const userProfileSchema = z.object({
  location: z.string().min(1),
  desiredPrice: z.number().positive(),
  grossIncome: z.number().nonnegative(),
  partnerIncome: z.number().nonnegative().optional(),
  eigenGeld: z.number().nonnegative(),
  schulden: z"number().nonnegative(),
  vastContract: z.boolean(),
  isStarter: z.boolean(),
  nhg: z.boolean(),
  biedStrategie: biedStrategieSchema,
});
