import { z } from "zod";
import { normalizePhone } from "@/lib/format";

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Informe o telefone.")
  .transform(normalizePhone)
  .refine((value) => /^\d{10,11}$/.test(value), "Use um telefone brasileiro válido.");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: phoneSchema,
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("A duração precisa ser maior que zero.")
    .refine((value) => value % 30 === 0, "A duração precisa ser múltiplo de 30 minutos."),
  isActive: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  isActive: z.boolean(),
});

export const businessSchema = z.object({
  address: z.string().trim().min(5, "Informe o endereço."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe o WhatsApp.")
    .transform((value) => value.replace(/\D/g, "")),
  instagramUrl: z.string().trim().url("Informe o link do Instagram."),
  mapEmbedUrl: z.string().trim().url("Informe o link do mapa."),
});

export const hoursSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    isOpen: z.boolean(),
    opensAt: z.string().optional(),
    closesAt: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (!value.isOpen) {
      return;
    }

    if (!value.opensAt || !value.closesAt || value.closesAt <= value.opensAt) {
      context.addIssue({
        code: "custom",
        message: "O fechamento precisa ser depois da abertura.",
        path: ["closesAt"],
      });
    }
  });

export const breakSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    startsAt: z.string().min(1, "Informe o início da pausa."),
    endsAt: z.string().min(1, "Informe o fim da pausa."),
  })
  .refine((value) => value.endsAt > value.startsAt, {
    message: "A pausa precisa terminar depois do início.",
    path: ["endsAt"],
  });
