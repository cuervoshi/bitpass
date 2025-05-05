import { Currency } from "prisma/client/index.js";
import { z } from "zod";

export const CreateTicketSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  price: z.number().nonnegative("Price must be ≥ 0"),
  currency: z.nativeEnum(Currency, {
    errorMap: () => ({
      message: `Currency must be one of ${Object.values(Currency).join(", ")}`,
    }),
  }),
  quantity: z.number().int().min(1, "Quantity must be ≥ 1"),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
