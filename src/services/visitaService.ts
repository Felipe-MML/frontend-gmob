import api from "./api";

export interface CreateVisitaDto {
  imovel_id: number;
  cliente_id: number;
  corretor_id: number;
  data_visita: string;
}

export interface Visita {
  visita_id: number;
  imovel_id: number;
  cliente_id: number;
  corretor_id: number;
  data_visita: string;
  status: "agendada" | "realizada" | "cancelada";
}

export const createVisita = async (
  visitaData: CreateVisitaDto
): Promise<Visita> => {
  try {
    const { data } = await api.post<Visita>("/visitas", visitaData);
    return data;
  } catch (error) {
    console.error("Erro ao agendar visita:", error);
    throw error;
  }
};
