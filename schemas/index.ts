import { Gender, UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const LoginWithPhoneSchema = z.object({
  phone: z.string().min(10, { message: "Phone number is required" }),
  otp: z.string().length(4, { message: "OTP must be exactly 6 digits" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const RegisterWithOtpSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export const RegularRegister = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  gender: z.string().min(1, {
    message: "Gender is required",
  }),
  dob: z.string().min(1, {
    message: "Date of birth is required",
  }),
  deviceType: z.string().min(1, {
    message: "Device type is required",
  }),
});

export const PhoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number is too long"),
});

export const OtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([
      UserRole.ADMIN,
      UserRole.USER,
      UserRole.SUPER_ADMIN,
      UserRole.EDITOR,
    ]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN", "EDITOR"]),
  loginType: z.enum(["EMAIL", "PHONE", "GOOGLE"]).optional(),
  password: z.string().optional(),
});

export const BlogSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long")
    .max(255, "Title must be at most 255 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  category: z
    .string()
    .min(2, "Category is required")
    .max(100, "Category must be at most 100 characters long"),
  subCategory: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean(),
});

export const reportSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.union([z.string(), z.array(z.string())]),
    }),
  ),
});

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  age: z.number().int().min(18, "You must be at least 18 years old"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  pinCode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
});

export const signinSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const AdminProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.string(),
  isTwoFactorEnabled: z.boolean(),
});

export const QuestionSchema = z.object({
  text: z.string().min(5, "Question text must be at least 5 characters long"),
  sequence: z.coerce
    .number()
    .min(1, "Sequence must be at least 1")
    .positive("Sequence must be a positive integer"),
  questionType: z.enum(["SINGLE_SELECT", "MULTIPLE_SELECT", "TEXT"]),
  required: z.boolean(),
  isActive: z.boolean(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text cannot be empty"),
        sequence: z.number(),
      }),
    )
    .optional(),
});

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().nonempty("Phone number is required"),
  email: z.string().email("Invalid email format"),
  location: z.string().min(1, "Location is required"),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export const LeadsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .min(10, "Invalid phone number")
    .max(10, "Invalid phone number"),
});

export const NewsLetterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const userSchema1 = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN", "EDITOR"]),
});

export const userSchema2 = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN", "EDITOR"]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  loginType: z.enum(["EMAIL", "PHONE", "GOOGLE"]),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  country: z.string().min(1, "Country is required"),
  language: z.string().min(1, "Language is required"),
  timeZone: z.string().min(1, "Timezone is required"),
  isTwoFactorEnabled: z.boolean(),
});

export const orderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type userSchema2Data = z.infer<typeof userSchema2>;
export type userSchema1Data = z.infer<typeof userSchema1>;
export type NewsLetterSchemaData = z.infer<typeof NewsLetterSchema>;
export type LeadsSchemaData = z.infer<typeof LeadsSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type BlogFormData = z.infer<typeof BlogSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type AdminFormData = z.infer<typeof AdminProfileSchema>;
export type QuestionFormValues = z.infer<typeof QuestionSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof ProfileSchema>;
export type LoginSchemaData = z.infer<typeof LoginSchema>;
export type LoginWithPhoneSchemaData = z.infer<typeof LoginWithPhoneSchema>;
export type PhoneSchemaData = z.infer<typeof PhoneSchema>;
export type NewPasswordSchemaData = z.infer<typeof NewPasswordSchema>;
export type RegisterWithOtpSchemaData = z.infer<typeof RegisterWithOtpSchema>;
export type RegisterSchemaData = z.infer<typeof RegisterSchema>;
export type ResetSchemaData = z.infer<typeof ResetSchema>;
export type SettingsSchemaData = z.infer<typeof SettingsSchema>;
export type OtpSchemaData = z.infer<typeof OtpSchema>;
export type RegularRegisterData = z.infer<typeof RegularRegister>;
