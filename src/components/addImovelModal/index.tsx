"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CreateImovelDto,
  TipoImovel,
  getTiposImoveis,
} from "@/services/imovelService";

import { toast } from "react-toastify";
import { Value } from "@radix-ui/react-select";

interface AddImovelModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (imovelData: CreateImovelDto) => Promise<void>;
}

const AddImovelModal = ({ open, onClose, onSave }: AddImovelModalProps) => {
  const [step, setStep] = useState(1);
  const [tiposImoveis, setTiposImoveis] = useState<TipoImovel[]>([]);
  const [tipoImovelId, setTipoImovelId] = useState<number | "">("");
  const [status, setStatus] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [valor, setValor] = useState("");
  const [area, setArea] = useState("");
  const [numeroComodos, setNumeroComodos] = useState("");
  const [descricao, setDescricao] = useState("");
  const [complemento, setComplemento] = useState("");

  useEffect(() => {
    if (open) {
      getTiposImoveis()
        .then(setTiposImoveis)
        .catch(() => toast.error("Erro ao carregar tipos de imóvel"));
    }
  }, [open]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
      toast.error("Por favor, preencha todos os campos.");
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
        numero_comodos: parseInt(numeroComodos) || 0,
        valor: parseFloat(valor),
        area: parseFloat(area),
        descricao: descricao,
        complemento: complemento,
      });

      // Reset campos
      setTipoImovelId("");
      setStatus("");
      setEstado("");
      setCidade("");
      setRua("");
      setNumero("");
      setValor("");
      setArea("");
      setDescricao("");
      setStep(1);
      onClose();
      toast.success("Imóvel cadastrado com sucesso!");
    } catch {
      toast.error("Erro ao cadastrar imóvel. Verifique os dados.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[695px] h-[638px] max-h-[vh] rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-3xl font-bold">
            Adicionar Novo Imóvel
          </DialogTitle>

          <h2 className="mt-10 text-2xl font-bold border-b-1 p-2 border-gray-400">
            {step == 1 && "Informações do Imóvel"}
            {step == 2 && "Informações de Endereço"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className=" min-h-98">
              <div className="flex flex-col items-center bg-gray rounded-2xl p-4">
                {step == 1 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full gap-3">
                      {/* Tipo Imóvel */}
                      <div>
                        <label
                          htmlFor="tipoImovelId"
                          className="block mb-1 font-medium"
                        >
                          Tipo de Imóvel
                        </label>
                        <Select
                          value={tipoImovelId ? String(tipoImovelId) : ""}
                          onValueChange={(value) =>
                            setTipoImovelId(parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-[275px] py-5 bg-white shadow-none">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposImoveis.map((tipo) => (
                              <SelectItem
                                key={tipo.tipo_imovel_id}
                                value={String(tipo.tipo_imovel_id)}
                              >
                                {tipo.nome_tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block mb-1 font-medium"
                        >
                          Status
                        </label>
                        <Select
                          value={status}
                          onValueChange={(value) => setStatus(value)}
                        >
                          <SelectTrigger className="w-[275px] py-5 bg-white shadow-none">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponivel">
                              Disponível
                            </SelectItem>
                            <SelectItem value="vendido">Vendido</SelectItem>
                            <SelectItem value="alugado">Alugado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex w-full gap-3">
                      {/* Número de cômodos */}
                      <div>
                        <label
                          htmlFor="numero_comodos"
                          className="block mb-1 font-medium"
                        >
                          Número de Cômodos
                        </label>
                        <input
                          id="numero_comodos"
                          type="text"
                          value={numeroComodos}
                          onChange={(e) => setNumeroComodos(e.target.value)}
                          required
                          className="w-[275px] rounded-md border bg-white p-2"
                          placeholder="Número de Cômodos"
                        />
                      </div>

                      {/* Área */}
                      <div>
                        <label
                          htmlFor="area"
                          className="block mb-1 font-medium"
                        >
                          Área (m²)
                        </label>
                        <input
                          id="area"
                          type="number"
                          step="0.01"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          required
                          className="w-[275px] rounded-md border p-2 bg-white"
                          placeholder="Área"
                        />
                      </div>
                    </div>

                    {/* Valor */}
                    <div>
                      <label htmlFor="valor" className="block mb-1 font-medium">
                        Valor
                      </label>
                      <input
                        id="valor"
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="w-[275px] rounded-md border border-gray-300 p-2 bg-white"
                        placeholder="Valor"
                      />
                    </div>

                    {/* Descrição */}

                    <div>
                      <label
                        htmlFor="descricao"
                        className="block mb-1 font-medium"
                      >
                        Descrição (Opcional)
                      </label>
                      <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border p-2 resize-none bg-white"
                        placeholder="Detalhes sobre o imóvel..."
                      />
                    </div>
                  </div>
                )}

                {step == 2 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full gap-3">
                      {/* Estado */}
                      <div>
                        <label
                          htmlFor="estado"
                          className="block mb-1 font-medium"
                        >
                          Estado
                        </label>
                        <input
                          id="estado"
                          type="text"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          required
                          className="w-[275px] rounded-md border p-2 bg-white"
                          placeholder="Estado"
                        />
                      </div>

                      {/* Cidade */}
                      <div>
                        <label
                          htmlFor="cidade"
                          className="block mb-1 font-medium"
                        >
                          Cidade
                        </label>
                        <input
                          id="cidade"
                          type="text"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          required
                          className="w-[275px] rounded-md border p-2 bg-white"
                          placeholder="Cidade"
                        />
                      </div>
                    </div>

                    <div className="flex w-full gap-3">
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
                          className="w-[275px] rounded-md border p-2 bg-white"
                          placeholder="Rua"
                        />
                      </div>

                      {/* Número */}
                      <div>
                        <label
                          htmlFor="numero"
                          className="block mb-1 font-medium"
                        >
                          Número
                        </label>
                        <input
                          id="numero"
                          type="text"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          required
                          className="w-[275px] rounded-md border p-2 bg-white"
                          placeholder="Número"
                        />
                      </div>
                    </div>

                    {/* Complemento */}
                    <div>
                      <label
                        htmlFor="complemento"
                        className="block mb-1 font-medium"
                      >
                        Complemento (Opcional)
                      </label>
                      <input
                        id="complemento"
                        type="text"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        className="w-[275px] rounded-md borde p-2 bg-white"
                        placeholder="Detalhes adicionais..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center space-x-2 ">
              <p>Página {step} de 2</p>
              {step == 1 && (
                <button
                  onClick={nextStep}
                  className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet transition duration-300"
                >
                  Próximo
                </button>
              )}
              {step == 2 && (
                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition duration-300"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet transition duration-300"
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddImovelModal;
