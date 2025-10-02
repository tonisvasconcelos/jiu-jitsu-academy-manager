import { z } from "zod";

export const TeacherSchema = z.object({
  teacherId: z.string().uuid().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  beltLevel: z.enum(["White", "Blue", "Purple", "Brown", "Black"]).default("Black"),
  branchId: z.string().uuid().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  active: z.boolean().default(true),
});

export type Teacher = z.infer<typeof TeacherSchema>;

