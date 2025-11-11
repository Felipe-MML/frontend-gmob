"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { Cliente, getClientes } from "@/services/clienteService";
import { Imovel, getImoveis } from "@/services/imovelService";
import { CreateVisitaDto } from "@/services/visitaService";

interface AddVisitaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateVisitaDto) => Promise<void>;
}

const AddVisitaModal = ({ open, onClose, onSave }: AddVisitaModalProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);

  const [clienteId, setClienteId] = useState<number | "">("");
  const [imovelId, setImovelId] = useState<number | "">("");
  const [dataVisita, setDataVisita] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [horaInicio, setHoraInicio] = useState("14:00");
  const [horaTermino, setHoraTermino] = useState("15:00");
  const [observacoes, setObservacoes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        // Carregar clientes ativos
        const clientesResp = await getClientes({ page: 1, limit: 1000 });
        const ativos = clientesResp.clientes.filter((c) => !c.arquivado);
        setClientes(ativos);

        // Carregar imóveis disponíveis
        const imoveisResp = await getImoveis({
          page: 1,
          limit: 1000,
          status: "disponivel",
        });
        setImoveis(imoveisResp.data);

        if (ativos.length > 0) setClienteId(ativos[0].cliente_id);
        if (imoveisResp.data.length > 0)
          setImovelId(imoveisResp.data[0].imovel_id);
      } catch {
        toast.error("Erro ao carregar dados para nova visita.");
      }
    };

    load();
  }, [open]);

  const resetForm = () => {
    setClienteId("");
    setImovelId("");
    setDataVisita(new Date().toISOString().split("T")[0]);
    setHoraInicio("14:00");
    setHoraTermino("15:00");
    setObservacoes("");
    setIsSaving(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!clienteId || !imovelId || !dataVisita || !horaInicio || !horaTermino) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Validação simples de horário
    if (horaTermino <= horaInicio) {
      toast.error("Hora de término deve ser maior que a hora de início.");
      return;
    }

    setIsSaving(true);
    const dto: CreateVisitaDto = {
      cliente_id: clienteId as number,
      imovel_id: imovelId as number,
      data_visita: dataVisita,
      hora_inicio: horaInicio,
      hora_termino: horaTermino,
      observacoes: observacoes || undefined,
    };

    try {
      await onSave(dto);
      toast.success("Visita criada com sucesso!");
      handleClose();
    } catch {
      toast.error("Falha ao criar a visita. Verifique os dados.");
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
        <DialogPanel className="w-[695px] h-[638px] max-h-[vh] rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-3xl font-bold">Nova Visita</DialogTitle>

          <h2 className="mt-10 text-2xl font-bold border-b-1 p-2 border-gray-400">
            Informações da Visita
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="min-h-98">
              <div className="flex flex-col items-center bg-gray rounded-2xl p-4">
                <div className="flex w-full gap-3 justify-between">
                  {/* Cliente */}
                  <div>
                    <label
                      htmlFor="cliente-visita"
                      className="block mb-1 font-medium"
                    >
                      Cliente
                    </label>
                    <select
                      id="cliente-visita"
                      value={clienteId}
                      onChange={(e) => setClienteId(Number(e.target.value))}
                      required
                      className="w-[275px] rounded-md border p-2 bg-white"
                    >
                      <option value="" disabled>
                        Selecione um cliente
                      </option>
                      {clientes.map((c) => (
                        <option key={c.cliente_id} value={c.cliente_id}>
                          {c.nome} ({c.cpf})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Imóvel */}
                  <div>
                    <label
                      htmlFor="imovel-visita"
                      className="block mb-1 font-medium"
                    >
                      Imóvel
                    </label>
                    <select
                      id="imovel-visita"
                      value={imovelId}
                      onChange={(e) => setImovelId(Number(e.target.value))}
                      required
                      className="w-[275px] rounded-md border p-2 bg-white"
                    >
                      <option value="" disabled>
                        Selecione um imóvel
                      </option>
                      {imoveis.map((i) => (
                        <option key={i.imovel_id} value={i.imovel_id}>
                          {i.rua}, {i.numero} — {i.cidade}/{i.estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex w-full gap-3 mt-2 justify-between">
                  {/* Data */}
                  <div>
                    <label
                      htmlFor="data_visita"
                      className="block mb-1 font-medium"
                    >
                      Data da Visita
                    </label>
                    <input
                      id="data_visita"
                      type="date"
                      value={dataVisita}
                      onChange={(e) => setDataVisita(e.target.value)}
                      required
                      className="w-[275px] rounded-md border p-2 bg-white"
                    />
                  </div>

                  {/* Hora início */}
                  <div>
                    <label
                      htmlFor="hora_inicio"
                      className="block mb-1 font-medium"
                    >
                      Hora de Início
                    </label>
                    <input
                      id="hora_inicio"
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                      className="w-[275px] rounded-md border p-2 bg-white"
                    />
                  </div>
                </div>

                <div className="flex w-full gap-3 mt-2 justify-between">
                  {/* Hora término */}
                  <div>
                    <label
                      htmlFor="hora_termino"
                      className="block mb-1 font-medium"
                    >
                      Hora de Término
                    </label>
                    <input
                      id="hora_termino"
                      type="time"
                      value={horaTermino}
                      onChange={(e) => setHoraTermino(e.target.value)}
                      required
                      className="w-[275px] rounded-md border p-2 bg-white"
                    />
                  </div>

                  {/* Observações */}
                  <div>
                    <label
                      htmlFor="observacoes"
                      className="block mb-1 font-medium"
                    >
                      Observações (Opcional)
                    </label>
                    <input
                      id="observacoes"
                      type="text"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-[275px] rounded-md border p-2 bg-white"
                      placeholder="Detalhes adicionais..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end items-center space-x-4 ">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-button px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition duration-300 disabled:opacity-70"
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddVisitaModal;
