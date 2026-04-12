import * as zod from "zod";

export const registerSchema = zod
    .object({
        firstName: zod
            .string()
            .trim()
            .nonempty("First name is required")
            .min(2, "First name must be at least 2 characters"),

        lastName: zod
            .string()
            .trim()
            .nonempty("Last name is required")
            .min(2, "Last name must be at least 2 characters"),

        username: zod
            .string()
            .trim()
            .optional()
            .or(zod.literal(""))

            .refine((val) => !val || val.length >= 3, {
                message: "Min 3 characters",
            })

            .refine((val) => !val || /^[a-zA-Z0-9._]+$/.test(val), {
                message: "Only letters, numbers, _ or .",
            })

            .refine((val) => !val || !(val.includes(".") && val.includes("_")), {
                message: "Use either . or _ not both",
            })

            .refine((val) => !val || !val.includes(".."), {
                message: "Dot cannot repeat",
            })

            .refine((val) => !val || !val.includes("__"), {
                message: "Underscore cannot repeat",
            })

            .refine((val) => !val || !/^[._]/.test(val), {
                message: "Cannot start with . or _",
            }),

        email: zod
            .string()
            .trim()
            .nonempty("Email is required")
            .email("Invalid email address"),

        day: zod.string().nonempty("Day is required"),
        month: zod.string().nonempty("Month is required"),
        year: zod.string().nonempty("Year is required"),

        gender: zod.enum(["male", "female"], {
            required_error: "Please select gender",
            invalid_type_error: "Please select gender",
        }),

        password: zod
            .string()
            .nonempty("Password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Must include uppercase letter")
            .regex(/[a-z]/, "Must include lowercase letter")
            .regex(/[0-9]/, "Must include number")
            .regex(/[^A-Za-z0-9]/, "At least one special character"),

        rePassword: zod.string().nonempty("RePassword is required"),
    })

    // Confirm Password
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    })

    .refine((data) => {
        const birthDate = new Date(
            Number(data.year),
            Number(data.month) - 1,
            Number(data.day)
        );

        return (
            birthDate.getFullYear() === Number(data.year) &&
            birthDate.getMonth() === Number(data.month) - 1 &&
            birthDate.getDate() === Number(data.day)
        );
    }, {
        message: "Invalid date",
        path: ["day"],
    })

    // Validate Age >= 14
    .refine((data) => {
        const birthDate = new Date(
            Number(data.year),
            Number(data.month) - 1,
            Number(data.day)
        );

        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 14;
    }, {
        message: "You must be at least 14 years old",
        path: ["year"],
    })

    // Transform Data To API
    .transform((data) => ({
        name: `${data.firstName} ${data.lastName}`,
        username: data.username || undefined,
        email: data.email,
        dateOfBirth: `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}`,
        gender: data.gender,
        password: data.password,
        rePassword: data.rePassword
    }));