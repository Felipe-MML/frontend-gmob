"use client";

import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { CreateClienteDto } from "@/services/clienteService";
import { IMaskInput } from "react-imask";

interface AddClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (clienteData: CreateClienteDto) => Promise<void>;
}

export default function AddClienteModal({
  open,
  onClose,
  onSave,
}: AddClienteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoInteresse, setTipoInteresse] = useState<"compra" | "aluguel">(
    "compra"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setCpf("");
    setTipoInteresse("compra");
    setError(null);
    setIsSaving(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave({
        nome_completo: nome,
        email,
        telefone,
        cpf,
        tipo_interesse: tipoInteresse,
      });
      handleClose();
    } catch (err) {
      setError(
        "Erro ao cadastrar cliente. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all data-closed:scale-95 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <DialogTitle className="text-lg font-bold">
            Adicionar Novo Cliente
          </DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="nome-cliente">Nome Completo</label>
              <input
                id="nome-cliente"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Nome do cliente..."
              />
            </div>
            <div>
              <label htmlFor="email-cliente">Email</label>
              <input
                id="email-cliente"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Email do cliente..."
              />
            </div>
            <div>
              <label htmlFor="telefone-cliente">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                id="telefone-cliente"
                value={telefone}
                onAccept={(_value, maskRef) => setTelefone(maskRef.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="(XX) XXXXX-XXXX"
                unmask={false}
              />
            </div>
            <div>
              <label htmlFor="cpf-cliente">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                id="cpf-cliente"
                value={cpf}
                onAccept={(_value, maskRef) => setCpf(maskRef.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="000.000.000-00"
                unmask={false}
              />
            </div>
            <div>
              <label htmlFor="interesse-cliente">Tipo de Interesse</label>
              <select
                id="interesse-cliente"
                value={tipoInteresse}
                onChange={(e) =>
                  setTipoInteresse(e.target.value as "compra" | "aluguel")
                }
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="compra">Compra</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-violet-400"
              >
                {isSaving ? "A guardar..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
