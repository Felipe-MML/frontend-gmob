import { useState, useEffect, useCallback } from "react";
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseImoveisReturn {
  data: Imovel[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  addImovel: (data: CreateImovelDto) => Promise<void>;
  editImovel: (id: number, data: UpdateImovelDto) => Promise<void>;
  removeImovel: (id: number) => Promise<void>;
  handlePageChange: (page: number) => void;
}
export const useImoveis = (): UseImoveisReturn => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchImoveis = useCallback(
    async (page: number) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getImoveis({ page, limit: 5 });
        setImoveis(response.data || []);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
        setError("Não foi possível carregar a lista de imóveis.");
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchImoveis(currentPage);
  }, [user, currentPage, fetchImoveis]);

  const addImovel = async (imovelData: CreateImovelDto) => {
    try {
      await createImovel(imovelData);
      fetchImoveis(currentPage === 1 ? 1 : 1);
      if (currentPage !== 1) setCurrentPage(1);
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
      fetchImoveis(currentPage);
    } catch (err) {
      console.error("Erro ao remover imóvel:", err);
      throw err;
    }
  };

  return {
    data: imoveis,
    pagination,
    loading,
    error,
    addImovel,
    editImovel,
    removeImovel,
    handlePageChange: setCurrentPage,
  };
};
