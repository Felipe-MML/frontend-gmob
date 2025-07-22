"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/components/privateRoute";
import EditCorretorModal from "@/components/editCorretorModal";
import {
  updateCorretor,
  UpdateCorretorDto,
  Corretor,
} from "@/services/corretorService";

const ProfileContent = () => {
  const { user, updateUser } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateProfile = async (id: number, data: UpdateCorretorDto) => {
    try {
      const corretorAtualizado = await updateCorretor(id, data);

      updateUser(corretorAtualizado);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Falha ao atualizar perfil: ", error);
      alert("Não foi possível atualizar o perfil. Tente novamente.");
      throw error;
    }
  };

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-8">
          <div className="w-full mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.nome_completo}
            </h1>
            <p className="text-md text-gray-500 capitalize">{user.perfil}</p>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 mt-3"
            >
              Editar Perfil
            </button>

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
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Telefone
                    </span>
                    <p className="text-gray-800">{user.telefone}</p>
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
                    <p className="text-gray-800">{user.cpf}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">
                      Membro Desde
                    </span>
                    <p className="text-gray-800">
                      {new Date(user.data_cadastro).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditCorretorModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateProfile}
        corretor={user}
      />
    </div>
  );
};

const ProfilePage = () => {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
};

export default ProfilePage;
