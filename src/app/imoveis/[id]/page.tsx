"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/privateRoute";
import RealizeTransaction from "@/components/realizeTransaction";

import { getImovelById, Imovel } from "@/services/imovelService";
import { getCorretorById, Corretor } from "@/services/corretorService";

import AgendarVisitaModal from "@/components/agendarVisitaModal";

const ImovelPageContent = () => {
  const params = useParams();
  const id = params.id as string;

  const [isTransacaoModalOpen, setIsTransacaoModalOpen] = useState(false);
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const imovelData = await getImovelById(id);
        setImovel(imovelData);

        if (imovelData && imovelData.corretor_id) {
          const corretorData = await getCorretorById(
            imovelData.corretor_id.toString()
          );
          setCorretor(corretorData);
        }
      } catch (err) {
        setError("Não foi possível carregar os dados do imóvel.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Carregando dados do imóvel...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!imovel) {
    return <div>Imóvel não encontrado</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Imóvel em {imovel.rua}, {imovel.numero}
        </h1>
        <p className="text-md text-gray-500 capitalize">
          {imovel.cidade} - {imovel.estado}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Detalhes do Imóvel
            </h2>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Status
              </span>
              <p className="text-gray-800 capitalize">{imovel.status}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">Valor</span>
              <p className="text-gray-800 font-bold text-lg">
                R$ {Number(imovel.valor).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">Área</span>
              <p className="text-gray-800">{imovel.area} m²</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Cômodos
              </span>
              <p className="text-gray-800">{imovel.numero_comodos}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Descrição
              </span>
              <p className="text-gray-800">{imovel.descricao || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Informações Adicionais
            </h2>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Cadastrado em
              </span>
              <p className="text-gray-800">
                {new Date(imovel.data_cadastro).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Corretor Responsável
              </span>
              <p className="text-gray-800">
                {corretor ? corretor.nome_completo : "Carregando..."}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Complemento
              </span>
              <p className="text-gray-800">{imovel.complemento || "N/A"}</p>
            </div>
            {imovel.status === "disponivel" ? (
              <div className="mt-8 gap-3 flex ">
                <button
                  onClick={() => setIsTransacaoModalOpen(true)}
                  className="bg-button p-2 rounded-2xl text-white hover:bg-violet-500 w-40 hover:cursor-pointer"
                >
                  Realizar Transação
                </button>
                <button className="bg-button p-2 rounded-2xl text-white hover:bg-violet-500 w-40 hover:cursor-pointer">
                  Agendar Visita
                </button>
              </div>
            ) : (
              <div className="mt-8 gap-3 flex flex-col ">
                <p className="font-bold">Esse imóvel Já foi {imovel.status}</p>
                <div className="flex gap-3">
                  <button className="bg-button p-2 rounded-2xl text-white hover:bg-violet-500 w-40 hover:cursor-pointer">
                    Ver detalhes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RealizeTransaction
        open={isTransacaoModalOpen}
        onClose={() => setIsTransacaoModalOpen(false)}
        imovel={imovel}
      />
    </div>
  );
};

const ImovelPage = () => {
  return (
    <PrivateRoute>
      <ImovelPageContent />
    </PrivateRoute>
  );
};

export default ImovelPage;
