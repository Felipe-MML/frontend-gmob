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
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold">
            Editar Cliente
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Nome Completo */}
            <div>
              <label htmlFor="edit-nome-cliente">Nome Completo</label>
              <input
                id="edit-nome-cliente"
                type="text"
                {...register("nome_completo")}
                className={`w-full border rounded-md p-2 ${
                  errors.nome_completo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.nome_completo.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="edit-email-cliente">Email</label>
              <input
                id="edit-email-cliente"
                type="email"
                {...register("email")}
                className={`w-full border rounded-md p-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="edit-telefone-cliente">Telefone</label>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="(00) 00000-0000"
                    id="edit-telefone-cliente"
                    value={field.value || ""}
                    onAccept={field.onChange}
                    className={`w-full border rounded-md p-2 ${
                      errors.telefone ? "border-red-500" : "border-gray-300"
                    }`}
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
              <label htmlFor="edit-cpf-cliente">CPF</label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="000.000.000-00"
                    id="edit-cpf-cliente"
                    value={field.value || ""}
                    onAccept={field.onChange}
                    className={`w-full border rounded-md p-2 ${
                      errors.cpf ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cpf.message}
                </p>
              )}
            </div>

            {/* Tipo de Interesse */}
            <div>
              <label htmlFor="edit-interesse-cliente">Tipo de Interesse</label>
              <select
                id="edit-interesse-cliente"
                {...register("tipo_interesse")}
                className={`w-full border rounded-md p-2 ${
                  errors.tipo_interesse ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="compra">Compra</option>
                <option value="aluguel">Aluguel</option>
              </select>
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
                {isSubmitting ? "A guardar..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
