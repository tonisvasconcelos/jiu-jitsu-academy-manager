import { z } from "zod";

export const StudentSchema = z.object({
  studentId: z.string().uuid().optional(),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  beltLevel: z.enum(["White", "Blue", "Purple", "Brown", "Black"]).default("White"),
  branchId: z.string().uuid().optional(),
  active: z.boolean().default(true),
  documentId: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type Student = z.infer<typeof StudentSchema>;

export const BeltLevels = [
  { value: "White", label: "Branca" },
  { value: "Blue", label: "Azul" },
  { value: "Purple", label: "Roxa" },
  { value: "Brown", label: "Marrom" },
  { value: "Black", label: "Preta" },
] as const;

export const Genders = [
  { value: "Male", label: "Masculino" },
  { value: "Female", label: "Feminino" },
  { value: "Other", label: "Outro" },
] as const;

