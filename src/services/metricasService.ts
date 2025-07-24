import api from "./api";

export interface Metricas {
  imoveisDisponiveis: number;
  imoveisVendidos: number;
  imoveisAlugados: number;
  totalClientes: number;
  totalTransacoes: number;
  totalVendas: number;
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
