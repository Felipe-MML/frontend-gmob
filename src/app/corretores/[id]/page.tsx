"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/privateRoute";
import { getCorretorById, Corretor } from "@/services/corretorService";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaFingerprint,
  FaCalendar,
} from "react-icons/fa6";

const CorretorProfileContent = () => {
  const params = useParams();
  const id = params.id as string;

  const [corretor, setCorretor] = useState<Corretor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCorretor = async () => {
      try {
        const data = await getCorretorById(id);
        setCorretor(data);
      } catch (error) {
        setError("Erro ao buscar corretor");
      } finally {
        setLoading(false);
      }
    };

    fetchCorretor();
  }, [id]);

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!corretor) {
    return <div>Corretor não encontrado</div>;
  }

  return (
    <div className="w-full max-w-350 mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-8">
          <div className="w-full mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">
              {corretor.nome_completo}
            </h1>
            <p className="text-md text-gray-500 capitalize">
              {corretor.perfil}
            </p>

            <div className="mt-6">
              <div className="flex flex-col md:flex-row md:space-x-12">
                <div className="flex-1 space-y-4">
                  <h2 className="flex gap-2 items-center text-xl font-semibold text-gray-700 border-b pb-2">
                    <FaUser className="text-blue-700" /> Contato
                  </h2>
                  <div className="flex bg-gray-200 p-2 rounded-2xl flex-col">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-200 p-2 rounded-2xl">
                        <FaEnvelope className="text-2xl text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-500">
                          Email
                        </span>
                        <p className="text-gray-800">{corretor.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-2xl">
                    <div className="bg-green-200 p-2 rounded-2xl">
                      <FaPhone className="text-2xl text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-500">
                        Telefone
                      </span>
                      <p className="text-gray-800">{corretor.telefone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 mt-6 md:mt-0">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700 border-b pb-2">
                    <FaIdCard className="text-purple-700 " /> Documentação
                  </h2>
                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-2xl">
                    <div className="bg-purple-200 p-2 rounded-2xl">
                      <FaFingerprint className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500">
                        CPF
                      </span>
                      <p className="text-gray-800">{corretor.cpf}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-2xl">
                    <div className="bg-yellow-200 p-2 rounded-2xl">
                      <FaCalendar className="text-2xl text-yellow-600 mx-auto" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500">
                        Membro Desde
                      </span>
                      <p className="text-gray-800">
                        {new Date(corretor.data_cadastro).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
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

const CorretorProfilePage = () => {
  return (
    <PrivateRoute>
      <CorretorProfileContent />
    </PrivateRoute>
  );
};

export default CorretorProfilePage;
