import { useState, useEffect } from "react";
import {
  getImoveis,
  deleteImovel,
  createImovel,
  updateImovel,
  CreateImovelDto,
  UpdateImovelDto,
  Imovel,
} from "@/services/imovelService";
import { useAuth } from "@/context/AuthContext";

interface UseImoveisReturn {
  imoveis: Imovel[];
  loading: boolean;
  error: string | null;
  addImovel: (data: CreateImovelDto) => Promise<void>;
  editImovel: (id: number, data: UpdateImovelDto) => Promise<void>;
  removeImovel: (id: number) => Promise<void>;
}

export const useImoveis = (): UseImoveisReturn => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setImoveis([]);
      return;
    }

    const fetchImoveis = async () => {
      try {
        const response = await getImoveis();
        setImoveis(response.imoveis ?? []); // fallback para array vazio
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
        setError("Não foi possível carregar a lista de imóveis.");
        setImoveis([]); // resetar para array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, [user]);


  const addImovel = async (imovelData: CreateImovelDto) => {
    try {
      const novo = await createImovel(imovelData);
      setImoveis((atuais) => [novo, ...atuais]);
    } catch (err) {
      console.error("Erro ao adicionar imóvel:", err);
      throw err;
    }
  };

  const editImovel = async (id: number, imovelData: UpdateImovelDto) => {
    try {
      const atualizado = await updateImovel(id, imovelData);
      setImoveis((atuais) =>
        atuais.map((i) => (i.imovel_id === id ? atualizado : i))
      );
    } catch (err) {
      console.error("Erro ao editar imóvel:", err);
      throw err;
    }
  };

  const removeImovel = async (id: number) => {
    try {
      await deleteImovel(id);
      setImoveis((atuais) => atuais.filter((i) => i.imovel_id !== id));
    } catch (err) {
      console.error("Erro ao remover imóvel:", err);
      throw err;
    }
  };

  return {
    imoveis,
    loading,
    error,
    addImovel,
    editImovel,
    removeImovel,
  };
};
