"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/privateRoute";
import { getVisitaById, Visita } from "@/services/visitaService";
import { getClienteById, Cliente } from "@/services/clienteService";
import { getCorretorById, Corretor } from "@/services/corretorService";
import { getImovelById, Imovel } from "@/services/imovelService";

import {
  FaCalendar,
  FaClock,
  FaStickyNote,
  FaHome,
  FaUser,
} from "react-icons/fa";

const VisitaPageContent = () => {
  const params = useParams();
  const id = params.id as string;

  const [visita, setVisita] = useState<Visita | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const visitaData = await getVisitaById(id);
        setVisita(visitaData);

        const [clienteData, corretorData, imovelData] = await Promise.all([
          getClienteById(visitaData.cliente_id.toString()),
          getCorretorById(visitaData.corretor_id.toString()),
          getImovelById(visitaData.imovel_id.toString()),
        ]);

        setCliente(clienteData);
        setCorretor(corretorData);
        setImovel(imovelData);
      } catch (err) {
        setError("Não foi possível carregar os detalhes da visita.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>A carregar detalhes da visita...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!visita) return <div>Visita não encontrada.</div>;

  return (
    <div className="w-full max-w-350 mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendar className="text-blue-700" />
            Detalhes da Visita
          </h1>

          {/* STATUS */}
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize
            ${
              visita.status_agendamento === "agendado"
                ? "bg-blue-100 text-blue-800"
                : ""
            }
            ${
              visita.status_agendamento === "realizado"
                ? "bg-green-100 text-green-800"
                : ""
            }
            ${
              visita.status_agendamento === "cancelado"
                ? "bg-red-100 text-red-800"
                : ""
            }
            ${
              visita.status_agendamento === "confirmado"
                ? "bg-yellow-100 text-yellow-800"
                : ""
            }
        `}
          >
            {visita.status_agendamento}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* AGENDAMENTO */}
          <div className="md:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              <FaClock className="text-blue-700" /> Agendamento
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* DATA */}
              <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-2xl">
                <div className="bg-blue-200 p-2 rounded-2xl">
                  <FaCalendar className="text-2xl text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500">
                    Data
                  </span>
                  <p className="text-gray-800">
                    {new Date(visita.data_visita).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* HORÁRIO */}
              <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-2xl">
                <div className="bg-yellow-200 p-2 rounded-2xl">
                  <FaClock className="text-2xl text-yellow-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500">
                    Horário
                  </span>
                  <p className="text-gray-800">
                    {new Date(visita.hora_inicio).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(visita.hora_termino).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* OBSERVAÇÕES */}
            <div className="flex items-start gap-2 bg-gray-200 p-3 rounded-2xl mt-4">
              <div className="bg-purple-200 p-2 rounded-2xl">
                <FaStickyNote className="text-2xl text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">
                  Observações
                </span>
                <p className="text-gray-800">
                  {visita.observacoes || "Nenhuma observação."}
                </p>
              </div>
            </div>
          </div>

          {/* IMÓVEL */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              <FaHome className="text-green-700" /> Imóvel
            </h2>

            <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-2xl">
              <div className="bg-green-200 p-2 rounded-2xl">
                <FaHome className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  {imovel ? `${imovel.rua}, ${imovel.numero}` : "Carregando..."}
                </p>
                <p className="text-gray-600">
                  {imovel ? `${imovel.cidade} - ${imovel.estado}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* CLIENTE */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              <FaUser className="text-blue-700" /> Cliente
            </h2>

            <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-2xl">
              <div className="bg-blue-200 p-2 rounded-2xl">
                <FaUser className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">{cliente?.nome}</p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">{cliente?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CORRETOR */}
          <div className="md:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              <FaUser className="text-purple-700" /> Corretor Responsável
            </h2>

            <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-2xl">
              <div className="bg-purple-200 p-2 rounded-2xl">
                <FaUser className="text-2xl text-purple-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  {corretor?.nome_completo}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">{corretor?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisitaPage = () => {
  return (
    <PrivateRoute>
      <VisitaPageContent />
    </PrivateRoute>
  );
};

export default VisitaPage;
