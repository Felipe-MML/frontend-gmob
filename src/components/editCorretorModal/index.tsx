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
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[695px] h-[630px] rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-3xl font-bold">
            Adicionar Novo Corretor
          </DialogTitle>

          <h2 className="mt-10 text-2xl font-bold border-b p-2 border-gray-400">
            Informações do Corretor
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="flex flex-col items-center bg-gray rounded-2xl p-4">
              <div className="flex justify-center w-full gap-3">
                {/* Nome Completo */}
                <div>
                  <label className="block mb-1 font-medium">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    {...register("nome_completo")}
                    className={`w-[275px] rounded-md border p-2 bg-white ${
                      errors.nome_completo ? "border-red-500" : ""
                    }`}
                    placeholder="Nome completo"
                  />
                  {errors.nome_completo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nome_completo.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-[275px] rounded-md border p-2 bg-white ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center w-full gap-3 mt-3">
                {/* Telefone */}
                <div>
                  <label className="block mb-1 font-medium">Telefone</label>
                  <Controller
                    name="telefone"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        mask="(00) 00000-0000"
                        value={field.value}
                        onAccept={field.onChange}
                        className={`w-[275px] rounded-md border p-2 bg-white ${
                          errors.telefone ? "border-red-500" : ""
                        }`}
                        placeholder="Telefone"
                      />
                    )}
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telefone.message}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block mb-1 font-medium">CPF</label>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        mask="000.000.000-00"
                        value={field.value}
                        onAccept={field.onChange}
                        className={`w-[275px] rounded-md border p-2 bg-white ${
                          errors.cpf ? "border-red-500" : ""
                        }`}
                        placeholder="CPF"
                      />
                    )}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cpf.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet transition disabled:bg-violet-400"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditCorretorModal;
