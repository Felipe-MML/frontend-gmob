"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { CreateCorretorDto } from "@/services/corretorService";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const corretorSchema = z
  .object({
    nome_completo: z.string().min(3, "O nome completo é obrigatório"),
    email: z
      .string()
      .email("Digite um email válido")
      .min(1, "O email é obrigatório"),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "O formato do telefone é inválido")
      .min(1, "O telefone é obrigatório"),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "O formato do CPF é inválido")
      .min(1, "O CPF é obrigatório"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não correspondem",
    path: ["confirmarSenha"],
  });

type CorretorFormData = z.infer<typeof corretorSchema>;

interface addCorretorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (corretorData: CreateCorretorDto) => Promise<void>;
}

export default function AddCorretorModal({
  open,
  onClose,
  onSave,
}: addCorretorModalProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CorretorFormData>({
    resolver: zodResolver(corretorSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      telefone: "",
      cpf: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setMostrarSenha(false);
    }
  }, [open, reset]);

  const onSubmit = async (data: CorretorFormData) => {
    try {
      const corretorData: CreateCorretorDto = {
        nome_completo: data.nome_completo,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        senha: data.senha,
      };
      await onSave(corretorData);
      toast.success("Corretor adicionado com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao adicionar corretor. Verifique os dados.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95">
          <DialogTitle className="text-lg font-bold">
            Adicionar Novo Corretor
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome-corretor">Nome Completo</label>
              <input
                id="nome-corretor"
                type="text"
                {...register("nome_completo")}
                className={`w-full border rounded-md p-2 ${
                  errors.nome_completo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nome do corretor..."
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.nome_completo.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email-corretor">Email</label>
              <input
                id="email-corretor"
                type="email"
                {...register("email")}
                className={`w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email do corretor..."
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone-corretor">Telefone</label>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="(00) 00000-0000"
                    id="telefone-corretor"
                    value={field.value}
                    onAccept={field.onChange}
                    className={`w-full border rounded-md p-2 ${
                      errors.telefone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Telefone do corretor..."
                  />
                )}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf-corretor">CPF</label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="000.000.000-00"
                    id="cpf-corretor"
                    value={field.value}
                    onAccept={field.onChange}
                    className={`w-full border rounded-md p-2 ${
                      errors.cpf ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="CPF do corretor..."
                  />
                )}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cpf.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  {...register("senha")}
                  className={`w-full border rounded-md p-2 pr-10 ${
                    errors.senha ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? "text" : "password"}
                  {...register("confirmarSenha")}
                  className={`w-full border rounded-md p-2 pr-10 ${
                    errors.confirmarSenha ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-violet-400"
              >
                {isSubmitting ? "A guardar..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
