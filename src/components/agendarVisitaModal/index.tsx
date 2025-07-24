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
import { createVisita, CreateVisitaDto } from "@/services/visitaService";
import { toast } from "react-toastify";

interface AgendarVisitaModalProps {
  open: boolean;
  onClose: () => void;
  imovel: Imovel | null;
}

const AgendarVisitaModal = ({
  open,
  onClose,
  imovel,
}: AgendarVisitaModalProps) => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<number | "">("");
  const [dataVisita, setDataVisita] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [horaInicio, setHoraInicio] = useState("14:00");
  const [horaTermino, setHoraTermino] = useState("15:00");
  const [observacoes, setObservacoes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      getClientes({ page: 1, limit: 1000 })
        .then((response) => {
          const clientesAtivos = response.clientes.filter((c) => !c.arquivado);
          setClientes(clientesAtivos);
          if (clientesAtivos.length > 0) {
            setSelectedClienteId(clientesAtivos[0].cliente_id);
          }
        })
        .catch(() => toast.error("Erro ao carregar a lista de clientes."));
    }
  }, [open]);

  const handleClose = () => {
    setIsSaving(false);
    setSelectedClienteId("");
    setHoraTermino("15:00");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !imovel ||
      !selectedClienteId ||
      !user ||
      !dataVisita ||
      !horaInicio ||
      !horaTermino
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);

    const dataHoraVisita = new Date(`${dataVisita}T${horaInicio}:00`);

    const visitaData: CreateVisitaDto = {
      imovel_id: imovel.imovel_id,
      cliente_id: selectedClienteId as number,
      data_visita: dataVisita,
      hora_inicio: horaInicio,
      hora_termino: horaTermino,
      observacoes: observacoes,
    };

    try {
      await createVisita(visitaData);
      toast.success("Visita agendada com sucesso!");
      handleClose();
    } catch (err) {
      toast.error("Falha ao agendar a visita. Verifique os dados.");
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
            Agendar Visita
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Imóvel: {imovel?.rua}, {imovel?.numero}
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="cliente-visita"
                className="block mb-1 font-medium"
              >
                Cliente
              </label>
              <select
                id="cliente-visita"
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
              <label htmlFor="data_visita" className="block mb-1 font-medium">
                Data da Visita
              </label>
              <input
                id="data_visita"
                type="date"
                value={dataVisita}
                onChange={(e) => setDataVisita(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="hora_visita" className="block mb-1 font-medium">
                Hora da Visita
              </label>
              <input
                id="hora_visita"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="hora_termino" className="block mb-1 font-medium">
                Hora de Término
              </label>
              <input
                id="hora_termino"
                type="time"
                value={horaTermino}
                onChange={(e) => setHoraTermino(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="observacoes" className="block mb-1 font-medium">
                Observações (Opcional)
              </label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Detalhes sobre a visita..."
              />
            </div>

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
                {isSaving ? "Agendando..." : "Confirmar Visita"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AgendarVisitaModal;
