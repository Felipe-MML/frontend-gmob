import { useState, useEffect, useMemo } from "react";
import {
  getCorretores,
  deleteCorretor,
  createCorretor,
  updateCorretor,
  CreateCorretorDto,
  UpdateCorretorDto,
  Corretor,
} from "@/services/corretorService";
import { useAuth } from "@/context/AuthContext";

interface UseCorretoresReturn {
  corretores: Corretor[];
  loading: boolean;
  error: string | null;
  addCorretor: (data: CreateCorretorDto) => Promise<void>;
  editCorretor: (id: number, data: UpdateCorretorDto) => Promise<void>;
  removeCorretor: (id: number) => Promise<void>;
}

export const useCorretores = (): UseCorretoresReturn => {
  const { user } = useAuth();
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.perfil !== "administrador") {
      setError(
        "Acesso negado. Você não tem permissão para esta funcionalidade."
      );
      setLoading(false);
      return;
    }

    const fetchCorretores = async () => {
      try {
        const response = await getCorretores();
        setCorretores(response.corretores);
      } catch (err) {
        setError("Não foi possível carregar a lista de corretores.");
      } finally {
        setLoading(false);
      }
    };

    fetchCorretores();
  }, [user]);

  const addCorretor = async (corretorData: CreateCorretorDto) => {
    try {
      const novoCorretor = await createCorretor(corretorData);
      setCorretores((atuais) => [novoCorretor, ...atuais]);
    } catch (err) {
      console.error("Erro ao adicionar corretor:", err);
      throw err;
    }
  };

  const editCorretor = async (id: number, corretorData: UpdateCorretorDto) => {
    try {
      const corretorAtualizado = await updateCorretor(id, corretorData);
      setCorretores((atuais) =>
        atuais.map((c) => (c.corretor_id === id ? corretorAtualizado : c))
      );
    } catch (err) {
      console.error("Erro ao editar corretor:", err);
      throw err;
    }
  };

  const removeCorretor = async (id: number) => {
    try {
      await deleteCorretor(id);
      setCorretores((atuais) => atuais.filter((c) => c.corretor_id !== id));
    } catch (err) {
      console.error("Erro ao remover corretor:", err);
      throw err;
    }
  };

  return {
    corretores,
    loading,
    error,
    addCorretor,
    editCorretor,
    removeCorretor,
  };
};
