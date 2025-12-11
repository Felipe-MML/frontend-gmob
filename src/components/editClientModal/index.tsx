"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { Cliente, UpdateClienteDto } from "@/services/clienteService";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";

const editClienteSchema = z.object({
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
  tipo_interesse: z.enum(["compra", "aluguel"]),
});

type ClienteFormData = z.infer<typeof editClienteSchema>;

interface EditClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, clienteData: UpdateClienteDto) => Promise<void>;
  cliente: Cliente | null;
}

export default function EditClienteModal({
  open,
  onClose,
  onSave,
  cliente,
}: EditClienteModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(editClienteSchema),
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nome_completo: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
        tipo_interesse: cliente.tipo_interesse,
      });
    }
  }, [cliente, reset]);

  const onSubmit = async (data: ClienteFormData) => {
    if (!cliente) return;

    try {
      await onSave(cliente.cliente_id, data);
      onClose();
      toast.success("Cliente atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar cliente. Verifique os dados.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[695px] h-auto rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-3xl font-bold">
            Editar Cliente
          </DialogTitle>

          <h2 className="mt-10 text-2xl font-bold border-b-1 p-2 border-gray-400">
            Informações do Cliente
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="flex flex-col items-center bg-gray rounded-2xl p-4 gap-4">
              {/* Nome e Email */}
              <div className="flex gap-3">
                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="nome-cliente"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="nome-cliente"
                    type="text"
                    {...register("nome_completo")}
                    className="w-[275px] rounded-md border bg-white p-2"
                    placeholder="Nome do cliente"
                  />
                  {errors.nome_completo && (
                    <p className="text-sm text-red-500">
                      {errors.nome_completo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="email-cliente"
                  >
                    Email
                  </label>
                  <input
                    id="email-cliente"
                    type="email"
                    {...register("email")}
                    className="w-[275px] rounded-md border bg-white p-2"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Telefone e CPF */}
              <div className="flex gap-3">
                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="telefone-cliente"
                  >
                    Telefone
                  </label>
                  <Controller
                    name="telefone"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        mask="(00) 00000-0000"
                        id="telefone-cliente"
                        value={field.value}
                        onAccept={field.onChange}
                        className="w-[275px] rounded-md border bg-white p-2"
                        placeholder="(xx) xxxxx-xxxx"
                      />
                    )}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500">
                      {errors.telefone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block font-medium mb-1"
                    htmlFor="cpf-cliente"
                  >
                    CPF
                  </label>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        mask="000.000.000-00"
                        id="cpf-cliente"
                        value={field.value}
                        onAccept={field.onChange}
                        className="w-[275px] rounded-md border bg-white p-2"
                        placeholder="000.000.000-00"
                      />
                    )}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500">{errors.cpf.message}</p>
                  )}
                </div>
              </div>

              {/* Tipo de Interesse */}
              <div>
                <label
                  className="block font-medium mb-1"
                  htmlFor="interesse-cliente"
                >
                  Tipo de Interesse
                </label>
                <select
                  id="interesse-cliente"
                  {...register("tipo_interesse")}
                  className="w-[275px] rounded-md border bg-white p-2"
                >
                  <option value="compra">Compra</option>
                  <option value="aluguel">Aluguel</option>
                </select>
                {errors.tipo_interesse && (
                  <p className="text-sm text-red-500">
                    {errors.tipo_interesse.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition duration-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet transition duration-300 disabled:bg-violet-300"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
