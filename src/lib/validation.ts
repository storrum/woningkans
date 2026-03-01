// ============================================
// WoningKans — Profile Validatie (Zod)
// Valideert Partial<UserProfile> → UserProfile
// ============================================

import { z } from "zod";
import type { UserProfile } from "@/types";

const BiedStrategieSchema = z.object({
  bovenVraagprijs:               z.boolean(),
  zonderFinancieringsvoorbehoud: z.boolean(),
  flexibeleOpleverdatum:         z.boolean(),
  snelleOverdracht:              z.boolean(),
  aankoopmakelaar:               z.boolean(),
  voorbehoudKeuring:             z.boolean().default(false),
  voorbehoudVerkoop:             z.boolean().default(false),
});

const UserProfileSchema = z.object({
  location:      z.string().min(1, "Vul een regio of stad in"),
  desiredPrice:  z.number().min(50_000, "Minimale woningprijs is €50.000"),
  grossIncome:   z.number().min(1, "Vul je jaarinkomen in"),
  partnerIncome: z.number().optional(),
  eigenGeld:     z.number().min(0),
  schulden:      z.number().min(0).default(0),
  nhg:           z.boolean().default(false),
  vastContract:  z.boolean(),
  isStarter:     z.boolean(),
  biedStrategie: BiedStrategieSchema,
});

export function validateProfile(partial: Partial<UserProfile>): UserProfile {
  return UserProfileSchema.parse(partial) as UserProfile;
}

export function safeValidateProfile(
  partial: Partial<UserProfile>
): { success: true; data: UserProfile } | { success: false; error: string } {
  const result = UserProfileSchema.safeParse(partial);
  if (result.success) {
    return { success: true, data: result.data as UserProfile };
  }
  const firstError = result.error.errors[0]?.message ?? "Ongeldige invoer";
  return { success: false, error: firstError };
}
