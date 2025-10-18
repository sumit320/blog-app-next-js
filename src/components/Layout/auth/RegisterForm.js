"use client";

import { Key, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerUserAction } from "@/actions/register";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const result = await registerUserAction(formData);
      console.log(result, "result");

      if (result.success) {
        toast.success(result.success); 
        router.push("/login");
      } else {
        toast.error(result.error || "Something went wrong!"); 
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div className="relative">
        <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        <Input
          {...register("name")}
          placeholder="Name"
          disabled={isLoading}
          className={`pl-10 bg-gray-50 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } text-gray-900 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="relative">
        <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          {...register("email")}
          placeholder="Email"
          disabled={isLoading}
          className={`pl-10 bg-gray-50 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } text-gray-900 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <Key className="absolute left-2 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="password"
          {...register("password")}
          placeholder="Password"
          disabled={isLoading}
          className={`pl-10 bg-gray-50 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } text-gray-900 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}

export default RegisterForm;
