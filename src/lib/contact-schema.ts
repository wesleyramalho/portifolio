import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  email: z.string().trim().min(1).max(254).email(),
  message: z.string().trim().min(1).max(2000),
});

export type ContactData = z.infer<typeof contactSchema>;
