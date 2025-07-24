"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { Corretor, UpdateCorretorDto } from "@/services/corretorService";
import { toast } from "react-toastify";

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
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    if (corretor) {
      setNomeCompleto(corretor.nome_completo);
      setEmail(corretor.email);
      setTelefone(corretor.telefone);
      setCpf(corretor.cpf);
    }
  }, [corretor]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!corretor) return;

    try {
      await onSave(corretor.corretor_id, {
        nome_completo: nomeCompleto,
        email,
        telefone,
        cpf,
      });
      toast.success("Corretor atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar corretor. Verifique os dados");
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <DialogTitle className="text-lg font-bold">
            Editar Corretor
          </DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label>Nome Completo</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label>Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
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
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditCorretorModal;
