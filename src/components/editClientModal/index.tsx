"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { Cliente, UpdateClienteDto } from "@/services/clienteService";
import { IMaskInput } from "react-imask";

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
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoInteresse, setTipoInteresse] = useState<"compra" | "aluguel">(
    "compra"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
      setCpf(cliente.cpf);
      setTipoInteresse(cliente.tipo_interesse);
    }
  }, [cliente]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    if (!cliente) return;

    try {
      await onSave(cliente.cliente_id, {
        nome_completo: nome,
        email,
        telefone,
        cpf,
        tipo_interesse: tipoInteresse,
      });
      onClose();
    } catch (err) {
      setError("Erro ao atualizar cliente. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
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
            Editar Cliente
          </DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-nome-cliente">Nome Completo</label>
              <input
                id="edit-nome-cliente"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-email-cliente">Email</label>
              <input
                id="edit-email-cliente"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-telefone-cliente">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                id="edit-telefone-cliente"
                value={telefone}
                unmask={false}
                onAccept={(value) => setTelefone(value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-cpf-cliente">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                id="edit-cpf-cliente"
                value={cpf}
                unmask={false}
                onAccept={(value) => setCpf(value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-interesse-cliente">Tipo de Interesse</label>
              <select
                id="edit-interesse-cliente"
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
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-violet-400"
              >
                {isSaving ? "A guardar..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
