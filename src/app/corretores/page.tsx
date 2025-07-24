"use client";

// API
import { UpdateCorretorDto } from "@/services/corretorService";

// Hooks
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCorretores } from "@/hooks/useCorretores";

// Components
import Table, { ColumDef } from "@/components/table";
import PrivateRoute from "@/components/privateRoute";
import Filters from "@/components/filters";
import DataRangeFilter from "@/components/dataRangeFilter";
import { FaTrash, FaPencilAlt, FaEye } from "react-icons/fa";
import DeleteModal from "@/components/deleteModal";
import PageTitle from "@/components/pagetitle";
import AddButton from "@/components/addButton";
import AddCorretorModal from "@/components/addCorretorModal";
import EditCorretorModal from "@/components/editCorretorModal";
import Pagination from "@/components/Pagination";
import Link from "next/link";

interface Corretor {
  corretor_id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  data_cadastro: string;
  perfil: "corretor" | "administrador";
}

const CorretoresPageContent = () => {
  // Corretores
  const {
    corretores,
    pagination,
    loading,
    error,
    addCorretor,
    editCorretor,
    removeCorretor,
    handlePageChange,
  } = useCorretores();

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCorretor, setSelectedCorretor] = useState<Corretor | null>(
    null
  );

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
        <div className="flex space-x-4">
          <Link
            href={`/corretores/${row.corretor_id}`}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </Link>
          <button
            onClick={() => {
              setSelectedCorretor(row);
              setIsEditModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => {
              setSelectedCorretor(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  // Lógica para Filtrar as Datas:
  const corretoresFilter = useMemo(() => {
    return corretores.filter((corretor) => {
      const registerDate = corretor.data_cadastro.split("T")[0];

      if (dateStart && registerDate < dateStart) return false;
      if (dateEnd && registerDate > dateEnd) return false;

      return true;
    });
  }, [corretores, dateStart, dateEnd]);

  const handleConfirmeDelete = async () => {
    if (!selectedCorretor) return;
    await removeCorretor(selectedCorretor.corretor_id);
    setIsDeleteModalOpen(false);
  };

  const handleSaveEdit = async (id: number, data: UpdateCorretorDto) => {
    await editCorretor(id, data);
    setIsEditModalOpen(false);
  };

  const handleFilterChange = (datas: {
    dateStart: string;
    dateEnd: string;
  }) => {
    setDateStart(datas.dateStart);
    setDateEnd(datas.dateEnd);
  };

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
        {!loading ? (
          <div className="w-full max-w-6xl mt-5">
            <Table data={corretoresFilter} columns={columns}></Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Carregando corretores...</p>
          </div>
        )}

        {pagination &&
          pagination.totalPages > 1 &&
          corretoresFilter.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}

        <AddCorretorModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={addCorretor}
        />

        <EditCorretorModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          corretor={selectedCorretor}
        />

        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmeDelete}
          title="Apagar Corretor"
        >
          <p>
            Tem a certeza que deseja apagar o corretor{" "}
            <strong>
              {selectedCorretor && selectedCorretor.nome_completo}
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
