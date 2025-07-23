"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!user) return;

    const fetchClientes = async () => {
      setLoading(true);
      try {
        const response = await getClientes(currentPage);

        setClientes(response.clientes);
        setPagination(response.pagination);
      } catch (err) {
        setError("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [user, currentPage]);

  const addCliente = async (data: CreateClienteDto) => {
    const novoCliente = await createCliente(data);
    const response = await getClientes(currentPage);

    setClientes(response.clientes);
    setPagination(response.pagination);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      const response = await getClientes(1);
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
    setClientes((atuais) => atuais.filter((c) => c.cliente_id !== id));
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
  };
};
