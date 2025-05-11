import { signupSchema, signinSchema } from "@/features/auth/schemas/auth";
import { db } from "@/lib/db";
import { hash, genSalt, compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { getUserById } from "@/features/user/db/user";
import { revalidateUserCache } from "@/features/user/db/cache";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninInput {
  email: string;
  password: string;
}

const generateJwtToken = async (userId: string) => {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN as string)
    .sign(secretKey);
};

const setCookeiToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  });
};

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const exitsUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (exitsUser) {
      return {
        message: "อีเมล์นี้มีผู้ใช้งานแล้ว",
      };
    }

    const salt = await genSalt(10);
    const hasPassword = await hash(data.password, salt);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hasPassword,
      },
    });

    const token = await generateJwtToken(newUser.id);

    await setCookeiToken(token);

    revalidateUserCache(newUser.id);
  } catch (error) {
    console.error("Error sign up user : ", error);

    return {
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  }
};

export const signin = async (input: SigninInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const exitsUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!exitsUser) {
      return {
        message: "ไม่พบอีเมล์นี้ในระบบ",
      };
    }

    if (exitsUser.status !== "Active") {
      return {
        message: "บัญชีของคุณไม่พร้อมใช้งาน",
      };
    }

    const isValidatePassword = await compare(data.password, exitsUser.password);

    if (!isValidatePassword) {
      return {
        message: "รหัสผ่านไม่ถูกต้อง",
      };
    }

    const token = await generateJwtToken(exitsUser.id);

    await setCookeiToken(token);
  } catch (error) {
    console.error("Error sing in user : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    };
  }
};

export const authCheck = async () => {
  const userId = (await headers()).get("x-user-id");

  return userId ? await getUserById(userId) : null;
};

export const signout = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("token");
  } catch (error) {
    console.error("Error sign out user : ", error);

    return {
      message: "เกิดข้อผิดพลาดในการออกจากระบบ",
    };
  }
};
