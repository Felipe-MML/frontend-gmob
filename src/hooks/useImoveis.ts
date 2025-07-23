import { useState, useEffect, useCallback } from "react";
import {
  getImoveis,
  Imovel,
  ImoveisResponse,
  GetImoveisParams,
  createImovel,
  updateImovel,
  deleteImovel,
  CreateImovelDto,
  UpdateImovelDto,
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
  setPagination: React.Dispatch<React.SetStateAction<PaginationData | null>>;
  setParams: React.Dispatch<React.SetStateAction<GetImoveisParams>>;
}

export const useImoveis = (
  initialParams: GetImoveisParams = {}
): UseImoveisReturn => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [pagination, setPagination] = useState<
    ImoveisResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetImoveisParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchImoveis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getImoveis(params);
      setImoveis(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar os imóveis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  const addImovel = async (imovelData: CreateImovelDto) => {
    try {
      await createImovel(imovelData);

      fetchImoveis();
    } catch (err) {
      console.error("Erro ao adicionar imóvel:", err);
      throw err;
    }
  };

  const editImovel = async (id: number, imovelData: UpdateImovelDto) => {
    try {
      await updateImovel(id, imovelData);

      fetchImoveis();
    } catch (err) {
      console.error("Erro ao editar imóvel:", err);
      throw err;
    }
  };

  const removeImovel = async (id: number) => {
    try {
      await deleteImovel(id);

      fetchImoveis();
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
    setPagination,
    setParams,
  };
};
