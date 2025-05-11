import { z } from "zod";

// Define Contants
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;
const SPECIAL_CHARACTERS = '!@#$%^&*(),.?":{}|<>';

// Define Validation Message
const ERROR_MESSAGE = {
  name: `ชื่อต้องต้องมีความยาวระหว่าง ${MIN_NAME_LENGTH} ถึง ${MAX_NAME_LENGTH} ตัวอักษร`,
  email: {
    format: `กรุณากรอกอีเมล์ให้ถูกต้อง`,
    domain: `อีเมล์ต้องเป็น Gmail, Yahoo, Hotmail หรือ Microsoft`,
  },
  password: {
    length: `รหัสผ่านต้องต้องมีความยาวระหว่าง ${MIN_PASSWORD_LENGTH} ถึง ${MAX_PASSWORD_LENGTH} ตัวอักษร`,
    uppercase: `รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว`,
    lowercase: `รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว`,
    number: `รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว`,
    specialChar: `รหัสผ่านต้องมีตัวอักษรพิเศษ ${SPECIAL_CHARACTERS} อย่างน้อย 1 ตัว`,
  },
  confirmPassword: `รหัสผ่านไม่ตรงกัน`,
};

// Define valid email domains
const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

// Email doamin validate
const isValidEmailDomain = (email: string) => {
  const domain = email ? email.split("@")[1] : "";
  return EMAIL_DOMAINS.includes(domain.toLowerCase());
};

//Password validate
const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, ERROR_MESSAGE.password.length)
  .max(MAX_PASSWORD_LENGTH, ERROR_MESSAGE.password.length)
  .regex(/[A-Z]/, ERROR_MESSAGE.password.uppercase)
  .regex(/[a-z]/, ERROR_MESSAGE.password.lowercase)
  .regex(/[0-9]/, ERROR_MESSAGE.password.number)
  .regex(new RegExp(`[${SPECIAL_CHARACTERS}]`), {
    message: ERROR_MESSAGE.password.specialChar,
  });

//Main Signup Schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine(
        (name) =>
          !name ||
          (name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH),
        ERROR_MESSAGE.name
      ),
    email: z
      .string()
      .email(ERROR_MESSAGE.email.format)
      .refine((email) => isValidEmailDomain(email), ERROR_MESSAGE.email.domain),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGE.confirmPassword,
    path: ["confirmPassword"],
  });

// Main Signin Schema
export const signinSchema = z.object({
  email: z
    .string()
    .email(ERROR_MESSAGE.email.format)
    .refine((email) => isValidEmailDomain(email), ERROR_MESSAGE.email.domain),
  password: passwordSchema,
});
