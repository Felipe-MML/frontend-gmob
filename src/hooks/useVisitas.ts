"use client";

import { useState, useEffect, useCallback } from "react";
import { getVisitas, Visita, deleteVisita } from "@/services/visitaService";
import { useAuth } from "@/context/AuthContext";
import { getClienteById } from "@/services/clienteService";
import { getCorretorById } from "@/services/corretorService";
import { getImovelById } from "@/services/imovelService";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useVisitas = () => {
  const { user } = useAuth();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVisitas = useCallback(
    async (page: number) => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await getVisitas({ page, limit: 10 });

        const enrichedVisitas = await Promise.all(
          response.visitas.map(async (visita) => {
            try {
              const [cliente, corretor, imovel] = await Promise.all([
                getClienteById(visita.cliente_id.toString()),
                getCorretorById(visita.corretor_id.toString()),
                getImovelById(visita.imovel_id.toString()),
              ]);

              return { ...visita, cliente, corretor, imovel };
            } catch (enrichError) {
              console.error(
                `Falha ao carregar detalhes para a visita ID ${visita.agendamento_id}:`,
                enrichError
              );
              return visita;
            }
          })
        );

        setVisitas(enrichedVisitas);
        setPagination(response.pagination);
      } catch (err) {
        setError("Não foi possível carregar a lista de visitas.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchVisitas(currentPage);
  }, [currentPage, fetchVisitas]);

  const removeVisita = async (id: number) => {
    await deleteVisita(id);
    if (visitas.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      fetchVisitas(currentPage);
    }
  };

  return {
    visitas,
    pagination,
    loading,
    error,
    removeVisita,
    handlePageChange: setCurrentPage,
  };
};
