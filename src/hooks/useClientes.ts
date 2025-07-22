"use client";

import { useState, useEffect } from "react";
import {
  getClientes,
  deleteCliente,
  createCliente,
  updateCliente,
  CreateClienteDto,
  UpdateClienteDto,
  Cliente,
  ClientesResponse,
} from "@/services/clienteService";
import { useAuth } from "@/context/AuthContext";

interface paginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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

        if (response && Array.isArray(response.clientes)) {
          setClientes(response.clientes);
          setPagination(response.pagination);
        } else if (Array.isArray(response)) {
          setClientes(response);
          setPagination(null);
          console.warn(
            "API retornou um array de clientes sem dados de paginação."
          );
        } else {
          throw new Error("Formato de resposta da API inválido.");
        }
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
    const clientesData = await getClientes(currentPage);

    if (Array.isArray(clientesData)) {
      setClientes(clientesData);
    } else {
      setClientes([]);
    }
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

  const removeCliente = async (id: number) => {
    await deleteCliente(id);
    setClientes((atuais) => atuais.filter((c) => c.cliente_id !== id));
  };

  return {
    clientes,
    pagination,
    loading,
    error,
    addCliente,
    editCliente,
    removeCliente,
    handlePageChange: setCurrentPage,
  };
};
