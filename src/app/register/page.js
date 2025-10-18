import RegisterForm from "@/components/Layout/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    redirect("/");
  }
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Register
            </h1>
            <p className="text-sm text-gray-500">
              Create your account to get started
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?
            <Link
              href="/login"
              className="font-semibold ml-2 text-black hover:text-black"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0">
          <Image
            src="/images/auth.jpg"
            alt="workspace"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="z-10 max-w-lg space-y-6 text-white text-right">
          <h2 className="text-4xl font-medium text-white">
            Join us to explore the best blog experience
          </h2>
          <p className="text-lg font-bold text-white">- Sumit</p>
        </div>
      </div>
    </div>
  );
}
