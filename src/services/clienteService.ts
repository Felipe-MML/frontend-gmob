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
  page = 1,
  limit = 5
): Promise<ClientesResponse> => {
  const { data } = await api.get("/clientes", { params: { page, limit } });
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

export const deleteCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};
