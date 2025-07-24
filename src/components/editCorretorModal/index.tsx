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
import { Corretor, UpdateCorretorDto } from "@/services/corretorService";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";

const editCorretorSchema = z.object({
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
});

type CorretorFormData = z.infer<typeof editCorretorSchema>;

interface EditCorretorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, corretorData: UpdateCorretorDto) => Promise<void>;
  corretor: Corretor | null;
}

const EditCorretorModal = ({
  open,
  onClose,
  onSave,
  corretor,
}: EditCorretorModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CorretorFormData>({
    resolver: zodResolver(editCorretorSchema),
  });

  useEffect(() => {
    if (corretor) {
      reset({
        nome_completo: corretor.nome_completo,
        email: corretor.email,
        telefone: corretor.telefone,
        cpf: corretor.cpf,
      });
    }
  }, [corretor, reset]);

  const onSubmit = async (data: CorretorFormData) => {
    if (!corretor) return;

    try {
      await onSave(corretor.corretor_id, data);
      toast.success("Corretor atualizado com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar corretor. Verifique os dados");
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
            Editar Corretor
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Nome Completo */}
            <div>
              <label>Nome Completo</label>
              <input
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
              <label>Email</label>
              <input
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
              <label>Telefone</label>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="(00) 00000-0000"
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
              <label>CPF</label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="000.000.000-00"
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

            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
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
};

export default EditCorretorModal;
