import api from "./api";

export interface Metricas {
  imoveisCadastrados: number;
  imoveisDisponiveis: number;
  imoveisVendidos: number;
  imoveisAlugados: number;
}

export const getMetricas = async (): Promise<Metricas> => {
  try {
    const { data } = await api.get<Metricas>("/metricas");
    return data;
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    throw error;
  }
};
