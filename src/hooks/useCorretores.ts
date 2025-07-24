"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCorretores,
  deleteCorretor,
  createCorretor,
  updateCorretor,
  CreateCorretorDto,
  UpdateCorretorDto,
  Corretor,
} from "@/services/corretorService";
import { useAuth } from "@/context/AuthContext";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseCorretoresReturn {
  corretores: Corretor[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  addCorretor: (data: CreateCorretorDto) => Promise<void>;
  editCorretor: (id: number, data: UpdateCorretorDto) => Promise<void>;
  removeCorretor: (id: number) => Promise<void>;
  handlePageChange: (page: number) => void;
}

export const useCorretores = (): UseCorretoresReturn => {
  const { user } = useAuth();
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchCorretores = useCallback(
    async (pageToFetch: number) => {
      if (user?.perfil !== "administrador") {
        setError(
          "Acesso negado. Você não tem permissão para esta funcionalidade."
        );
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getCorretores({ page: pageToFetch, limit: 5 });
        setCorretores(response.corretores);
        setPagination(response.pagination);
      } catch (err) {
        setError("Não foi possível carregar a lista de corretores.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchCorretores(currentPage);
  }, [user, currentPage, fetchCorretores]);

  const addCorretor = async (corretorData: CreateCorretorDto) => {
    try {
      await createCorretor(corretorData);

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchCorretores(1);
      }
    } catch (err) {
      console.error("Erro ao adicionar corretor:", err);
      throw err;
    }
  };

  const editCorretor = async (id: number, corretorData: UpdateCorretorDto) => {
    try {
      const corretorAtualizado = await updateCorretor(id, corretorData);
      setCorretores((atuais) =>
        atuais.map((c) => (c.corretor_id === id ? corretorAtualizado : c))
      );
    } catch (err) {
      console.error("Erro ao editar corretor:", err);
      throw err;
    }
  };

  const removeCorretor = async (id: number) => {
    try {
      await deleteCorretor(id);
      if (corretores.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchCorretores(currentPage);
      }
    } catch (err) {
      console.error("Erro ao remover corretor:", err);
      throw err;
    }
  };

  return {
    corretores,
    pagination,
    loading,
    error,
    addCorretor,
    editCorretor,
    removeCorretor,
    handlePageChange: setCurrentPage,
  };
};
