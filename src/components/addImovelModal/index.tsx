"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

import { CreateImovelDto, TipoImovel, getTiposImoveis } from "@/services/imovelService";

interface AddImovelModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (imovelData: CreateImovelDto) => Promise<void>;
}

const AddImovelModal = ({ open, onClose, onSave }: AddImovelModalProps) => {
  const [tiposImoveis, setTiposImoveis] = useState<TipoImovel[]>([]);
  const [tipoImovelId, setTipoImovelId] = useState<number | "">("");
  const [status, setStatus] = useState("disponivel");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [valor, setValor] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Buscar tipos de imóveis quando o modal abrir
  useEffect(() => {
    if (open) {
      getTiposImoveis()
        .then(setTiposImoveis)
        .catch(() => setError("Erro ao carregar tipos de imóvel"));
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      tipoImovelId === "" ||
      !status ||
      !estado ||
      !cidade ||
      !rua ||
      !numero ||
      !valor ||
      !area
    ) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await onSave({
        tipo_imovel_id: tipoImovelId as number,
        status,
        estado,
        cidade,
        rua,
        numero,
        valor: parseFloat(valor),
        area: parseFloat(area),
      });

      // Reset campos
      setTipoImovelId("");
      setStatus("disponivel");
      setEstado("");
      setCidade("");
      setRua("");
      setNumero("");
      setValor("");
      setArea("");
      onClose();
    } catch {
      setError("Erro ao cadastrar imóvel. Verifique os dados.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold">Adicionar Novo Imóvel</DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Tipo Imóvel */}
            <div>
              <label htmlFor="tipoImovelId" className="block mb-1 font-medium">
                Tipo de Imóvel
              </label>
              <select
                id="tipoImovelId"
                value={tipoImovelId}
                onChange={(e) => setTipoImovelId(parseInt(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled hidden>
                  Selecione o tipo
                </option>
                {tiposImoveis.map((tipo) => (
                  <option key={tipo.tipo_imovel_id} value={tipo.tipo_imovel_id}>
                    {tipo.nome_tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-1 font-medium">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="disponivel">Disponível</option>
                <option value="vendido">Vendido</option>
                <option value="alugado">Alugado</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block mb-1 font-medium">
                Estado
              </label>
              <input
                id="estado"
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Estado"
              />
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="cidade" className="block mb-1 font-medium">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Cidade"
              />
            </div>

            {/* Rua */}
            <div>
              <label htmlFor="rua" className="block mb-1 font-medium">
                Rua
              </label>
              <input
                id="rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Rua"
              />
            </div>

            {/* Número */}
            <div>
              <label htmlFor="numero" className="block mb-1 font-medium">
                Número
              </label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Número"
              />
            </div>

            {/* Valor */}
            <div>
              <label htmlFor="valor" className="block mb-1 font-medium">
                Valor
              </label>
              <input
                id="valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Valor"
              />
            </div>

            {/* Área */}
            <div>
              <label htmlFor="area" className="block mb-1 font-medium">
                Área (m²)
              </label>
              <input
                id="area"
                type="number"
                step="0.01"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Área"
              />
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
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddImovelModal;
