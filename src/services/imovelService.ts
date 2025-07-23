import api from "./api";

// ========== Tipos ==========
export interface Imovel {
  imovel_id: number;
  corretor_id: number;
  tipo_imovel_id: number;
  status: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  complemento?: string;
  valor: number;
  area: number;
  numero_comodos?: number;
  descricao?: string;
  data_cadastro: string;
}

export interface CreateImovelDto {
  tipo_imovel_id: number;
  status: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  complemento?: string;
  valor: number;
  area: number;
  numero_comodos?: number;
  descricao?: string;
}

export interface UpdateImovelDto extends Partial<CreateImovelDto> {}

export interface ImoveisResponse {
  imoveis: Imovel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TipoImovel {
  tipo_imovel_id: number;
  nome_tipo: string;
}

export interface GetImoveisParams {
  page?: number;
  limit?: number;
  cidade?: string;
  status?: string;
  valorMin?: number;
  valorMax?: number;
  estado?: string;
  tipo_imovel_id?: number;
}

// ========== Imóveis ==========
export const getImoveis = async (
  params: GetImoveisParams = {}
): Promise<ImoveisResponse> => {
  try {
    const { data } = await api.get<ImoveisResponse>("/imoveis", { params });
    return data;
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    throw error;
  }
};

export const getImovelById = async (id: number): Promise<Imovel> => {
  try {
    const { data } = await api.get<Imovel>(`/imoveis/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar imóvel ID ${id}:`, error);
    throw error;
  }
};

export const createImovel = async (
  imovelData: CreateImovelDto
): Promise<Imovel> => {
  try {
    const { data } = await api.post<Imovel>("/imoveis", imovelData);
    return data;
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    throw error;
  }
};

export const updateImovel = async (
  id: number,
  imovelData: UpdateImovelDto
): Promise<Imovel> => {
  try {
    const { data } = await api.patch<Imovel>(`/imoveis/${id}`, imovelData);
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar imóvel ID ${id}:`, error);
    throw error;
  }
};

export const deleteImovel = async (id: number): Promise<void> => {
  try {
    await api.delete(`/imoveis/${id}`);
  } catch (error) {
    console.error(`Erro ao apagar imóvel ID ${id}:`, error);
    throw error;
  }
};

// ========== Tipos de Imóveis ==========
export const getTiposImoveis = async (): Promise<TipoImovel[]> => {
  try {
    const { data } = await api.get<TipoImovel[]>("/tipos-imoveis");
    return data;
  } catch (error) {
    console.error("Erro ao buscar tipos de imóveis:", error);
    throw error;
  }
};

export const createTipoImovel = async (nome_tipo: string): Promise<TipoImovel> => {
  try {
    const { data } = await api.post<TipoImovel>("/tipos-imoveis", { nome_tipo });
    return data;
  } catch (error) {
    console.error("Erro ao criar tipo de imóvel:", error);
    throw error;
  }
};

export const deleteTipoImovel = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tipos-imoveis/${id}`);
  } catch (error) {
    console.error(`Erro ao apagar tipo de imóvel ID ${id}:`, error);
    throw error;
  }
};
