import LoginForm from "@/components/Layout/auth/LoginForm";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    redirect("/");
  }
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Login
            </h1>
            <p className="text-sm text-gray-500">
              Welcome Back! Please enter your details
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?
            <Link
              className="font-semibold text-black hover:text-gray-700 ml-2"
              href={"/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image with Text */}
      <div className="hidden md:flex w-1/2 p-12 items-center justify-center relative bg-cover bg-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/auth.jpg"
          alt="workspace"
          className="absolute inset-0 object-cover w-full h-full"
        />

        {/* Text Content */}
        <div className="max-w-lg space-y-6 text-white z-10 text-right">
          <h2 className="text-4xl font-medium leading-snug drop-shadow-lg">
            Join us to explore the best blog experience
          </h2>
          <p className="text-lg font-semibold drop-shadow-md">— Sumit</p>
        </div>
      </div>
    </div>
  );
}
