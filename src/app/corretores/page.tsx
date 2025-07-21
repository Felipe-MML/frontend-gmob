"use client";

// API
import {
  getCorretores,
  deleteCorretor,
  createCorretor,
  CreateCorretorDto,
} from "@/services/corretorService";

// Hooks
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

// Components
import Table, { ColumDef } from "@/components/table";
import PrivateRoute from "@/components/privateRoute";
import Filters from "@/components/filters";
import DataRangeFilter from "@/components/dataRangeFilter";
import { FaTrash } from "react-icons/fa";
import DeleteModal from "@/components/deleteModal";
import PageTitle from "@/components/pagetitle";
import AddButton from "@/components/addButton";
import AddCorretorModal from "@/components/addCorretorModal";

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
  const [corretorToDelete, setCorretorToDelete] = useState<Corretor | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    {
      accessorKey: "corretor_id",
      header: "Ações",
      cell: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleOpenConfirmModal(row)}
            className="text-red-500 hover:text-red-700"
            title="Apagar corretor"
          >
            <FaTrash />
          </button>
        </div>
      ),
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

  // Adicionar Corretor:
  const handleSaveCorretor = async (corretorData: CreateCorretorDto) => {
    try {
      const newCorretor = await createCorretor(corretorData);

      setCorretores((currentCorretores) => [newCorretor, ...currentCorretores]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.log("Erro ao salvar: ", error);

      throw error;
    }
  };

  // Deletar o corretor:
  const handleOpenConfirmModal = (corretor: Corretor) => {
    setCorretorToDelete(corretor);
    setIsModalOpen(true);
  };

  const handleConfirmeDelete = async () => {
    if (!corretorToDelete) return;

    try {
      await deleteCorretor(corretorToDelete.corretor_id);
      setCorretores((currentCorretores) =>
        currentCorretores.filter(
          (c) => c.corretor_id !== corretorToDelete.corretor_id
        )
      );
    } catch (error) {
      alert("Erro ao apagar o corretor");
    } finally {
      setIsModalOpen(false);
      setCorretorToDelete(null);
    }
  };

  // Lógica para Filtrar as Datas:
  const corretoresFilter = useMemo(() => {
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
    <div className="w-full flex flex-col items-center ">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Tabela de Corretores" />
          <AddButton
            text="+ Adicionar"
            openModal={() => setIsAddModalOpen(true)}
          />
        </div>

        <Filters title="Filtros">
          <DataRangeFilter
            dateStart={dateStart}
            dateEnd={dateEnd}
            onFilterChange={handleFilterChange}
          />
        </Filters>

        <div className="w-full max-w-6xl mt-5">
          <Table data={corretoresFilter} columns={columns}></Table>
        </div>

        <AddCorretorModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveCorretor}
        />

        <DeleteModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmeDelete}
          title="Apagar Corretor"
        >
          <p>
            Tem a certeza que deseja apagar o corretor{" "}
            <strong>
              {corretorToDelete && corretorToDelete.nome_completo}
            </strong>
            ?
          </p>
        </DeleteModal>
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
