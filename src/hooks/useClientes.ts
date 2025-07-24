"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getClientes,
  archiveClient,
  createCliente,
  updateCliente,
  CreateClienteDto,
  UpdateClienteDto,
  Cliente,
} from "@/services/clienteService";
import { useAuth } from "@/context/AuthContext";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useClientes = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tipoInteresse, setTipoInteresse] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const fetchClientes = useCallback(
    async (pageToFetch: number) => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await getClientes({
          page: pageToFetch,
          limit: 5,
          tipoInteresse,
          datainicio: dataInicio,
          datafim: dataFim,
        });
        setClientes(response.clientes || []);
        setPagination(response.pagination);
        if (
          pageToFetch > response.pagination.totalPages &&
          response.pagination.totalPages > 0
        ) {
          setCurrentPage(response.pagination.totalPages);
        }
      } catch (err) {
        setError("Não foi possível carregar a lista de clientes.");
        setClientes([]);
      } finally {
        setLoading(false);
      }
    },
    [user, tipoInteresse, dataInicio, dataFim]
  );

  useEffect(() => {
    fetchClientes(currentPage);
  }, [fetchClientes, currentPage]);

  const addCliente = async (data: CreateClienteDto) => {
    await createCliente(data);

    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchClientes(1);
    }
  };

  const editCliente = async (id: number, data: UpdateClienteDto) => {
    const clienteAtualizado = await updateCliente(id, data);
    setClientes((atuais) =>
      atuais.map((c) => (c.cliente_id === id ? clienteAtualizado : c))
    );
  };

  const archiveClienteHook = async (id: number) => {
    await archiveClient(id);

    if (clientes.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      fetchClientes(currentPage);
    }
  };

  return {
    clientes,
    pagination,
    loading,
    error,
    addCliente,
    editCliente,
    removeCliente: archiveClienteHook,
    handlePageChange: setCurrentPage,
    filters: { tipoInteresse, dataInicio, dataFim },
    setFilters: { setTipoInteresse, setDataInicio, setDataFim },
  };
};
