import api from "./api";

// Interface para os dados de criação de uma transação
export interface CreateTransacaoDto {
  imovel_id: number;
  cpf: string;
  tipo_transacao: "venda" | "aluguel";
}

// Interface para o objeto de transação retornado pela API
export interface Transacao {
  transacao_id: number;
  imovel_id: number;
  cliente_id: number;
  corretor_id: number;
  valor_transacao: number;
  data_transacao: string;
  tipo_transacao: "venda" | "aluguel";
}

export const createTransacao = async (
  transacaoData: CreateTransacaoDto
): Promise<Transacao> => {
  try {
    const { data } = await api.post<Transacao>("/transacoes", transacaoData);
    return data;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};
