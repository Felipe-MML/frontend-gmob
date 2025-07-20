"use client";

// API
import { getCorretores } from "@/services/corretorService";

// Hooks
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

// Components
import Table, { ColumDef } from "@/components/table";
import PrivateRoute from "@/components/privateRoute";
import Filters from "@/components/filters";
import DataRangeFilter from "@/components/dataRangeFilter";

interface Corretor {
  corretor_id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  data_cadastro: string;
}

const CorretoresPageContent = () => {
  const { user } = useAuth();
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  // Colunas da tabela:

  const columns: ColumDef<Corretor>[] = [
    {
      accessorKey: "nome_completo",
      header: "Nome Completo",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
    },
    {
      accessorKey: "cpf",
      header: "CPF",
    },
    {
      accessorKey: "data_cadastro",
      header: "Data de Cadastro",
      cell: (row) => {
        const data = new Date(row.data_cadastro);
        return data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
  ];

  useEffect(() => {
    if (user?.perfil !== "administrador") {
      setError(
        "Acesso negado. Você não tem permissão para acessar essa página"
      );
      setLoading(false);
      return;
    }

    const fetchCorretores = async () => {
      try {
        const response = await getCorretores();
        setCorretores(response.corretores);
      } catch (err) {
        setError("Não foi possivel carregar a lista de corretores");
      } finally {
        setLoading(false);
      }
    };

    fetchCorretores();
  }, [user]);

  // Lógica para Filtrar as Datas:
  const corretoresFiltrados = useMemo(() => {
    return corretores.filter((corretor) => {
      const registerDate = corretor.data_cadastro.split("T")[0];

      if (dateStart && registerDate < dateStart) return false;
      if (dateEnd && registerDate > dateEnd) return false;

      return true;
    });
  }, [corretores, dateStart, dateEnd]);

  const handleFilterChange = (datas: {
    dateStart: string;
    dateEnd: string;
  }) => {
    setDateStart(datas.dateStart);
    setDateEnd(datas.dateEnd);
  };

  if (loading) {
    return <div>Carregando corretores...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <Filters title="Filtros">
        <DataRangeFilter
          dateStart={dateStart}
          dateEnd={dateEnd}
          onFilterChange={handleFilterChange}
        />
      </Filters>
      <div className="w-full max-w-[1126px] mt-5">
        <Table data={corretoresFiltrados} columns={columns}></Table>
      </div>
    </div>
  );
};

const corretoresPage = () => {
  return (
    <PrivateRoute>
      <CorretoresPageContent />
    </PrivateRoute>
  );
};

export default corretoresPage;
