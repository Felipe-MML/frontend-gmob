"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { Imovel } from "@/services/imovelService";
import { Cliente, getClientes } from "@/services/clienteService";
import {
  createTransacao,
  CreateTransacaoDto,
} from "@/services/transacaoService";

interface RealizarTransacaoModalProps {
  open: boolean;
  onClose: () => void;
  imovel: Imovel | null;
}

const RealizarTransacaoModal = ({
  open,
  onClose,
  imovel,
}: RealizarTransacaoModalProps) => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<number | "">("");
  const [valor, setValor] = useState("");
  const [dataTransacao, setDataTransacao] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tipoTransacao, setTipoTransacao] = useState<"venda" | "aluguel">(
    "venda"
  );

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && imovel) {
      setValor(imovel.valor.toString());
      getClientes({ page: 1, limit: 1000 })
        .then((response) => {
          const clientesAtivos = response.clientes.filter((c) => !c.arquivado);
          setClientes(clientesAtivos);
        })
        .catch(() => setError("Erro ao carregar a lista de clientes."));
    }
  }, [open, imovel]);

  const handleClose = () => {
    setError(null);
    setIsSaving(false);
    setSelectedClienteId("");
    setTipoTransacao("venda");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !imovel ||
      !selectedClienteId ||
      !user ||
      !valor ||
      parseFloat(valor) <= 0
    ) {
      setError("Por favor, preencha todos os campos com valores válidos.");
      return;
    }

    setIsSaving(true);

    const clienteSelecionado = clientes.find(
      (c) => c.cliente_id === selectedClienteId
    );

    if (!clienteSelecionado) {
      setError("Cliente selecionado inválido. Por favor, tente novamente.");
      setIsSaving(false);
      return;
    }

    const transacaoData: CreateTransacaoDto = {
      imovel_id: imovel.imovel_id,
      cpf: clienteSelecionado.cpf,
      tipo_transacao: tipoTransacao,
    };

    try {
      await createTransacao(transacaoData);
      handleClose();
      window.location.reload();
    } catch (err) {
      setError("Falha ao registrar a transação. Verifique os dados.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold">
            Realizar Transação
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Imóvel: {imovel?.rua}, {imovel?.numero}
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="cliente" className="block mb-1 font-medium">
                Cliente
              </label>
              <select
                id="cliente"
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(Number(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled>
                  Selecione um cliente
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.cliente_id} value={cliente.cliente_id}>
                    {cliente.nome} ({cliente.cpf})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="tipo_transacao"
                className="block mb-1 font-medium"
              >
                Tipo de Transação
              </label>
              <select
                id="tipo_transacao"
                value={tipoTransacao}
                onChange={(e) =>
                  setTipoTransacao(e.target.value as "venda" | "aluguel")
                }
                required
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="data_transacao"
                className="block mb-1 font-medium"
              >
                Data da Transação
              </label>
              <input
                id="data_transacao"
                type="date"
                value={dataTransacao}
                onChange={(e) => setDataTransacao(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
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
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-violet-400"
              >
                {isSaving ? "Salvando..." : "Confirmar Transação"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RealizarTransacaoModal;
