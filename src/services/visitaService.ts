import api from "./api";
import { Cliente } from "./clienteService";
import { Corretor } from "./corretorService";
import { Imovel } from "./imovelService";

export interface CreateVisitaDto {
  imovel_id: number;
  cliente_id: number;
  data_visita: string;
  hora_inicio: string;
  hora_termino: string;
  observacoes?: string;
}

export interface Visita {
  agendamento_id: number;
  imovel_id: number;
  cliente_id: number;
  corretor_id: number;
  data_visita: string;
  hora_inicio: string;
  hora_termino: string;
  observacoes: string | null;
  status_agendamento: "agendado" | "confirmado" | "cancelado" | "realizado";
  data_agendamento: string;

  cliente?: Cliente;
  corretor?: Corretor;
  imovel?: Imovel;
}

interface ApiResponse {
  data: Visita[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface VisitasResponse {
  visitas: Visita[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VisitaFilters {
  page?: number;
  limit?: number;
}

export const getVisitas = async (
  filters: VisitaFilters = {}
): Promise<VisitasResponse> => {
  try {
    const { data: apiResponse } = await api.get<ApiResponse>("/agendamentos", {
      params: filters,
    });

    const response: VisitasResponse = {
      visitas: apiResponse.data,
      pagination: {
        page: apiResponse.page,
        limit: apiResponse.limit,
        total: apiResponse.total,
        totalPages: apiResponse.totalPages,
      },
    };

    return response;
  } catch (error) {
    console.error("Erro ao buscar visitas:", error);
    throw error;
  }
};

export const createVisita = async (
  visitaData: CreateVisitaDto
): Promise<Visita> => {
  try {
    const { data } = await api.post<Visita>("/agendamentos", visitaData);
    return data;
  } catch (error) {
    console.error("Erro ao agendar visita:", error);
    throw error;
  }
};

export const deleteVisita = async (id: number): Promise<void> => {
  try {
    await api.delete(`/agendamentos/${id}`);
  } catch (error) {
    console.error(`Erro ao apagar a visita com ID ${id}:`, error);
    throw error;
  }
};

export const getVisitaById = async (id: string): Promise<Visita> => {
  try {
    const { data } = await api.get<Visita>(`/agendamentos/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar a visita com ID ${id}:`, error);
    throw error;
  }
};
