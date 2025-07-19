"use client";

// Components
import Button from "@/components/button";
import Link from "next/link";

// hooks
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { loadComponents } from "next/dist/server/load-components";

const page: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      console.log("Falha no login: ", error);
      setError("Email ou senha incorretos!");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col bg-white w-[450px] h-[608px] rounded-2xl shadow-2xl">
        <img
          src="/logo.png"
          className="w-[180px] h-[64px] mt-[32px] self-center"
        />
        <div className="mt-[32px] ml-[32px]">
          <h2 className="text-2xl text-gray-800">Bem-vindo! 👋</h2>
          <p className="text-gray-600">Digite suas credenciais para entrar:</p>
        </div>

        <form className="mt-[32px] ml-[32px] w-[386px]" onSubmit={handleSubmit}>
          <label className="flex flex-col ">
            <span>Email</span>
            <input
              type="email"
              name="userEmail"
              placeholder="Digite seu email..."
              required
              value={email}
              onChange={handleEmailChange}
              className="border border-gray-200 h-10 rounded-md focus:outline-none"
            />
          </label>
          <div className="flex flex-col mt-3">
            <div className="flex justify-between">
              <label form="password">Senha</label>

              <Link
                href="/recuperarSenha"
                className="text-violet-600 hover:text-violet-900"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
              className="border border-gray-200 h-10 rounded-md focus:outline-none"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <label>
            <input type="checkbox" name="rememberUser" className="mt-5 mb-5" />
            <span className="ml-1">Manter Login</span>
          </label>
          <Button text="Entrar" />
        </form>
      </div>
    </div>
  );
};

export default page;
