import api from "./api";

export interface Corretor {
  corretor_id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: "corretor" | "administrador";
  data_cadastro: string;
}

export interface CreateCorretorDto {
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  perfil?: "corretor" | "administrador";
}

export interface UpdateCorretorDto {
  nome_completo?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  senha?: string;
  perfil?: "corretor" | "administrador";
}

// Paginação
interface CorretoresResponse {
  corretores: Corretor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CorretorFilters {
  page?: number;
  limit?: number;
  datainicio?: string;
  datafim?: string;
}

export const getCorretores = async (
  filters: CorretorFilters = {}
): Promise<CorretoresResponse> => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== "" && value != null
      )
    );

    const { data } = await api.get<CorretoresResponse>("/corretor", {
      params,
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar corretores: ", error);
    throw error;
  }
};

export const deleteCorretor = async (id: number): Promise<void> => {
  try {
    await api.delete(`/corretor/${id}`);
  } catch (error) {
    console.log(`Erro ao apagar o corretor com ID ${id}:`, error);
    throw error;
  }
};

export const createCorretor = async (
  corretorData: CreateCorretorDto
): Promise<Corretor> => {
  try {
    const { data } = await api.post<Corretor>("/corretor", corretorData);
    return data;
  } catch (error) {
    console.log("Erro ao criar corretor: ", error);
    throw error;
  }
};

export const updateCorretor = async (
  id: number,
  corretorData: UpdateCorretorDto
): Promise<Corretor> => {
  try {
    const { data } = await api.patch<Corretor>(`/corretor/${id}`, corretorData);
    return data;
  } catch (error) {
    console.log(`Erro ao atualizar o corretor com ID ${id}: `, error);
    throw error;
  }
};

export const getCorretorById = async (id: string): Promise<Corretor> => {
  try {
    const { data } = await api.get<Corretor>(`/corretor/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar o corretor com ID ${id}:`, error);
    throw error;
  }
};
