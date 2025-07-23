import api from "./api";

import { Corretor } from "./corretorService";

export interface Cliente {
  cliente_id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tipo_interesse: "compra" | "aluguel";
  arquivado: boolean;
  data_cadastro: string;
  corretor: Corretor;
}

interface ClienteFilters {
  page?: number;
  limit?: number;
  tipoInteresse?: string;
  datainicio?: string;
  datafim?: string;
}

export interface CreateClienteDto {
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  tipo_interesse: "compra" | "aluguel";
}

export type UpdateClienteDto = Partial<CreateClienteDto>;

export interface ClientesResponse {
  clientes: Cliente[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getClientes = async (
  filters: ClienteFilters = {}
): Promise<ClientesResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value != null)
  );

  const { data } = await api.get("/clientes", { params });
  return data;
};
export const createCliente = async (
  clienteData: CreateClienteDto
): Promise<Cliente> => {
  const { data } = await api.post("/clientes", clienteData);
  return data;
};

export const updateCliente = async (
  id: number,
  clienteData: UpdateClienteDto
): Promise<Cliente> => {
  const { data } = await api.patch(`/clientes/${id}`, clienteData);
  return data;
};

export const archiveClient = async (id: number): Promise<void> => {
  await api.patch(`/clientes/${id}/arquivar`);
};
