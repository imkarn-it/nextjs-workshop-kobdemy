import AuthHeader from "@/features/auth/components/auth-header";
import AuthForm from "@/features/auth/components/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
  description:
    "ร้านค้าออนไลน์อันดับ 1 สินค้าไอทีครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า",
};

const SignupPage = () => {
  return (
    <AuthHeader type="signup">
      <AuthForm type="signup" />
    </AuthHeader>
  );
};
export default SignupPage;
