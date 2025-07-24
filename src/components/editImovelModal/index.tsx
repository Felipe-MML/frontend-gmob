"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import {
  Imovel,
  UpdateImovelDto,
  TipoImovel,
  getTiposImoveis,
} from "@/services/imovelService";
import { toast } from "react-toastify";

interface EditImovelModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, imovelData: UpdateImovelDto) => Promise<void>;
  imovel: Imovel | null;
}

const EditImovelModal = ({
  open,
  onClose,
  onSave,
  imovel,
}: EditImovelModalProps) => {
  const [tiposImoveis, setTiposImoveis] = useState<TipoImovel[]>([]);
  const [tipoImovelId, setTipoImovelId] = useState<number | "">("");
  const [status, setStatus] = useState("disponivel");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [valor, setValor] = useState("");
  const [area, setArea] = useState("");
  const [numeroComodos, setNumeroComodos] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (imovel) {
      setTipoImovelId(imovel.tipo_imovel_id);
      setStatus(imovel.status);
      setEstado(imovel.estado);
      setCidade(imovel.cidade);
      setRua(imovel.rua);
      setNumero(imovel.numero);
      setComplemento(imovel.complemento || "");
      setValor(imovel.valor.toString());
      setArea(imovel.area.toString());
      setNumeroComodos((imovel.numero_comodos || "").toString());
      setDescricao(imovel.descricao || "");
    }
  }, [imovel]);

  useEffect(() => {
    if (open) {
      getTiposImoveis()
        .then(setTiposImoveis)
        .catch(() => toast.error("Erro ao carregar tipos de imóvel"));
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imovel) return;

    setIsSaving(true);
    try {
      const imovelData: UpdateImovelDto = {
        tipo_imovel_id: tipoImovelId as number,
        status,
        estado,
        cidade,
        rua,
        numero,
        complemento,
        valor: parseFloat(valor),
        area: parseFloat(area),
        numero_comodos: parseInt(numeroComodos) || undefined,
        descricao,
      };

      await onSave(imovel.imovel_id, imovelData);
      onClose();
      toast.success("Imóvel atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar imóvel. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold">Editar Imóvel</DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="edit-tipoImovelId"
                className="block mb-1 font-medium"
              >
                Tipo de Imóvel
              </label>
              <select
                id="edit-tipoImovelId"
                value={tipoImovelId}
                onChange={(e) => setTipoImovelId(parseInt(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {tiposImoveis.map((tipo) => (
                  <option key={tipo.tipo_imovel_id} value={tipo.tipo_imovel_id}>
                    {tipo.nome_tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-status" className="block mb-1 font-medium">
                Status
              </label>
              <select
                id="edit-status"
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

            <div>
              <label htmlFor="edit-estado" className="block mb-1 font-medium">
                Estado
              </label>
              <input
                id="edit-estado"
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-cidade" className="block mb-1 font-medium">
                Cidade
              </label>
              <input
                id="edit-cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-rua" className="block mb-1 font-medium">
                Rua
              </label>
              <input
                id="edit-rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-numero" className="block mb-1 font-medium">
                Número
              </label>
              <input
                id="edit-numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="edit-complemento"
                className="block mb-1 font-medium"
              >
                Complemento
              </label>
              <input
                id="edit-complemento"
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="edit-valor" className="block mb-1 font-medium">
                Valor (R$)
              </label>
              <input
                id="edit-valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor="edit-area" className="block mb-1 font-medium">
                Área (m²)
              </label>
              <input
                id="edit-area"
                type="number"
                step="0.01"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="edit-numeroComodos"
                className="block mb-1 font-medium"
              >
                Nº de Cômodos
              </label>
              <input
                id="edit-numeroComodos"
                type="number"
                value={numeroComodos}
                onChange={(e) => setNumeroComodos(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="edit-descricao"
                className="block mb-1 font-medium"
              >
                Descrição
              </label>
              <textarea
                id="edit-descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
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
                disabled={isSaving}
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-violet-400"
              >
                {isSaving ? "A guardar..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditImovelModal;
