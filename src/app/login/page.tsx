"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";

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
    <div className="flex min-h-screen bg-white">
      <Image
        alt="Logo Gmob"
        className="absolute top-12 left-10 w-[150px] h-[55px] hover:scale-110 transition duration-200"
        src="/logo.png"
        width={150}
        height={55}
      />
      <div className="w-screen lg:w-1/2 flex flex-col justify-center items-center">
        <div className="flex justify-center sm:w-full items-center">
          <div className="flex flex-col">
            <div className="flex flex-col items-center px-8">
              <h2 className="font-bold text-2xl">Bem vindo(a) de volta</h2>
              <p className="text-gray-600">
                Informe seus dados para acessar sua conta.
              </p>
            </div>

            <form className="mt-8 px-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <div className="mb-2">
                    <label htmlFor="email">Email</label>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu_email@mail.com"
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
                  <div className="flex justify-between mb-2">
                    <label htmlFor="senha">Senha</label>
                  </div>
                  <div className="relative">
                    <input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
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
                <Button text="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 m-3 bg-lightPurple rounded-2xl flex-col justify-center items-center px-6">
        <h1 className="text-3xl font-bold">
          Descomplique sua gestão imobiliária
        </h1>
        <p className="my-2">
          Acesse a plataforma para saber como controlar todos os aspectos do seu
          negócio.
        </p>
        <Image
          src="/imagemLogin.svg"
          alt="imagem inicial"
          width={500}
          height={500}
        ></Image>
      </div>
    </div>
  );
};

export default LoginPage;
