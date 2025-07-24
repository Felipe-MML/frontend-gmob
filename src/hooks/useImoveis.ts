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

export const useImoveis = (initialParams: GetImoveisParams = {}) => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [pagination, setPagination] = useState<
    ImoveisResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetImoveisParams>({
    page: 1,
    limit: 5,
    status: "",
    cidade: "",
    estado: "",
    ...initialParams,
  });

  const fetchImoveis = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== "" && value != null
        )
      );
      const response = await getImoveis(cleanParams);
      setImoveis(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar os imóveis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, user]);

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  const addImovel = async (imovelData: CreateImovelDto) => {
    try {
      await createImovel(imovelData);

      setParams({ page: 1, limit: 5 });
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

      if (imoveis.length === 1 && params.page && params.page > 1) {
        setParams((prevParams) => ({
          ...prevParams,
          page: prevParams.page! - 1,
        }));
      } else {
        fetchImoveis();
      }
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
    params,
    setParams,
  };
};
