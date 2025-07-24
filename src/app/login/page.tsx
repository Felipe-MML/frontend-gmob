"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z
    .string()
    .email("Por favor, insira um email válido.")
    .min(1, "O email é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.log("Falha no login: ", error);
      toast.error("Email ou senha incorretos!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col bg-white w-[450px] h-auto py-8 rounded-2xl shadow-2xl">
        <img src="/logo.png" className="w-[180px] h-[64px] self-center" />
        <div className="mt-8 px-8">
          <h2 className="text-2xl text-gray-800">Bem-vindo! 👋</h2>
          <p className="text-gray-600">Digite suas credenciais para entrar:</p>
        </div>

        <form className="mt-8 px-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                {...register("email")}
                className={`w-full border rounded-md h-10 focus:outline-none p-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex justify-between">
                <label htmlFor="senha">Senha</label>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("password")}
                  className={`w-full border rounded-md h-10 p-2 pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <Button text="Entrar" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
