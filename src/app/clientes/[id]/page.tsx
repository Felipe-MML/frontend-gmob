"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/privateRoute";
import { getClienteById, Cliente } from "@/services/clienteService";
import { getCorretorById, Corretor } from "@/services/corretorService";

const ClienteProfileContent = () => {
  const params = useParams();
  const id = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const clienteData = await getClienteById(id);
        setCliente(clienteData);

        if (clienteData && clienteData.corretor_id) {
          const corretorData = await getCorretorById(
            clienteData.corretor_id.toString()
          );
          setCorretor(corretorData);
        }
      } catch (err) {
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Carregando cliente...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-8">
          <div className="w-full mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">{cliente.nome}</h1>
            <p className="text-md text-gray-500 capitalize">
              {cliente.tipo_interesse}
            </p>
            <div className="mt-6">
              <div className="flex flex-col md:flex-row md:space-x-12">
                <div className="flex-1 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Contato
                  </h2>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Email
                    </span>
                    <p className="text-gray-800">{cliente.email}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Telefone
                    </span>
                    <p className="text-gray-800">{cliente.telefone}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-4 mt-6 md:mt-0">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Documentação
                  </h2>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      CPF
                    </span>
                    <p className="text-gray-800">{cliente.cpf}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Cadastrado em:
                    </span>
                    <p className="text-gray-800">
                      {new Date(cliente.data_cadastro).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Corretor Responsável:
                    </span>
                    <p className="text-gray-800">
                      {corretor && corretor.nome_completo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClienteProfile = () => {
  return (
    <PrivateRoute>
      <ClienteProfileContent />
    </PrivateRoute>
  );
};

export default ClienteProfile;
