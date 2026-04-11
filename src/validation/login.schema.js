import * as zod from "zod";

// Login Schema & Validations Input
export const loginSchema = zod.object({
    email: zod.string()
        .nonempty("Email is required")
        .email('Invalid email address'),
    password: zod.string()
        .nonempty("Password is required")
        .min(6, "Password must be 6 characters")
        .regex(/[A-Z]/, "Must include uppercase letter")
        .regex(/[a-z]/, "Must include lowercase letter")
        .regex(/[0-9]/, "Must include number")
        .regex(/[^A-Za-z0-9]/, "At least one special character")
});