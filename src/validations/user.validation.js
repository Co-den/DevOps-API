import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .trim(),
  email: z
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password cannot exceed 255 characters")
    .trim(),
  role: z.enum(["user", "admin"]).default("user").optional(),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters")
      .trim()
      .optional(),
    email: z
      .email("Invalid email format")
      .max(255, "Email cannot exceed 255 characters")
      .toLowerCase()
      .trim()
      .optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .strict();

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive("User ID must be a positive integer"),
});
