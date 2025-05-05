import { z } from "zod";

export const AddTeamSchema = z.object({
  userId: z.string().uuid("Must be a valid UUID"),
  role: z.enum(["MODERATOR", "COLLABORATOR"], {
    errorMap: () => ({ message: "Role must be MODERATOR or COLLABORATOR" }),
  }),
});

export type AddTeamInput = z.infer<typeof AddTeamSchema>;

export const UpdateTeamSchema = z.object({
  role: z.enum(["OWNER", "MODERATOR", "COLLABORATOR"], {
    errorMap: () => ({
      message: "Role must be OWNER, MODERATOR or COLLABORATOR",
    }),
  }),
});

export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
