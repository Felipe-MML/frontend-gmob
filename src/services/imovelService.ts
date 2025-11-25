import api from "./api";

// ========== Tipos ==========
export interface Imovel {
  imovel_id: number;
  corretor_id: number;
  tipo_imovel_id: number;
  disponibilidade: string;
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
  imagens: string[];
}

export interface CreateImovelDto {
  tipo_imovel_id: number;
  disponibilidade: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  complemento?: string;
  valor: number;
  area: number;
  numero_comodos: number;
  descricao?: string;
  imagens?: File[];
}

export type UpdateImovelDto = Partial<CreateImovelDto>;

interface ApiImoveisResponse {
  data: Imovel[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ImoveisResponse {
  data: Imovel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
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
  datainicio?: string;
  datafim?: string;
}

// ========== Imóveis ==========
export const getImoveis = async (
  params: GetImoveisParams = {}
): Promise<ImoveisResponse> => {
  try {
    const { data: apiResponse } = await api.get<ApiImoveisResponse>(
      "/imoveis",
      { params }
    );
    const response: ImoveisResponse = {
      data: apiResponse.data,
      pagination: {
        total: apiResponse.total,
        page: apiResponse.page,
        totalPages: apiResponse.lastPage,
        limit: params.limit || 5,
      },
    };

    return response;
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    throw error;
  }
};

export const getImovelById = async (id: string): Promise<Imovel> => {
  try {
    const { data } = await api.get<Imovel>(`/imoveis/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar o imóvel com ID ${id}:`, error);
    throw error;
  }
};

export const createImovel = async (
  imovelData: CreateImovelDto
): Promise<Imovel> => {
  try {
    let headers = {};
    const { data } = await api.post<Imovel>("/imoveis", { ...imovelData, imagens: undefined });

    console.log("dataImovel", data)

    if (imovelData.imagens && imovelData.imagens.length > 0) {
      const formData = new FormData();

      // Append images
      imovelData.imagens.forEach((file) => {
        formData.append("files", file);
      });

      headers = { "Content-Type": "multipart/form-data" };

      const { data: dataImagens } = await api.post<Imovel>(`/imoveis/${data.imovel_id}/imagens`, formData, { headers });

      console.log("dataImagens", dataImagens)
    }

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

export const createTipoImovel = async (
  nome_tipo: string
): Promise<TipoImovel> => {
  try {
    const { data } = await api.post<TipoImovel>("/tipos-imoveis", {
      nome_tipo,
    });
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
