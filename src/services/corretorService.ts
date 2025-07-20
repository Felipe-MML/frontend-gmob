import api from "./api";

interface Corretor {
  corretor_id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: "corretor" | "administrador";
  data_cadastro: string;
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

export const getCorretores = async (
  page = 1,
  limit = 10
): Promise<CorretoresResponse> => {
  try {
    const { data } = await api.get<CorretoresResponse>("/corretor", {
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar corretores: ", error);
    throw error;
  }
};
