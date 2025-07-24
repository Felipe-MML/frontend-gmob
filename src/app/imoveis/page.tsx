"use client";

import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash, FaEye } from "react-icons/fa";

// API
import { UpdateImovelDto } from "@/services/imovelService";

// Hooks
import { useAuth } from "@/context/AuthContext";
import { useImoveis } from "@/hooks/useImoveis";

// Components
import Table, { ColumDef } from "@/components/table";
import PrivateRoute from "@/components/privateRoute";
import PageTitle from "@/components/pagetitle";
import AddButton from "@/components/addButton";
import Filters from "@/components/filters";
import DataRangeFilter from "@/components/dataRangeFilter";
import DeleteModal from "@/components/deleteModal";
import AddImovelModal from "@/components/addImovelModal";
import EditImovelModal from "@/components/editImovelModal";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import StatusFilter from "@/components/statusFilter";
import TextFilter from "@/components/textFilter";

interface Imovel {
  imovel_id: number;
  status: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  valor: number;
  area: number;
  data_cadastro: string;
  corretor_id: number;
  tipo_imovel_id: number;
}

const ImoveisPageContent = () => {
  const { user } = useAuth();
  const {
    data: imoveis,
    pagination,
    loading,
    error,
    addImovel,
    editImovel,
    removeImovel,
    params,
    setParams,
  } = useImoveis();

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [cidadeFilter, setCidadeFilter] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setParams((prevParams) => ({
        ...prevParams,
        page: 1,
        status: statusFilter || undefined,
        estado: estadoFilter || undefined,
        cidade: cidadeFilter || undefined,
      }));
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [statusFilter, estadoFilter, cidadeFilter, setParams]);

  const columns: ColumDef<Imovel>[] = [
    { accessorKey: "status", header: "Status" },
    { accessorKey: "estado", header: "Estado" },
    { accessorKey: "cidade", header: "Cidade" },
    { accessorKey: "rua", header: "Rua" },
    { accessorKey: "numero", header: "Número" },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: (row) => `R$ ${row.valor}`,
    },
    {
      accessorKey: "area",
      header: "Área (m²)",
    },
    {
      accessorKey: "data_cadastro",
      header: "Data de Cadastro",
      cell: (row) => {
        const data = new Date(row.data_cadastro);
        return data.toLocaleDateString("pt-BR");
      },
    },
    {
      accessorKey: "imovel_id",
      header: "Ações",
      cell: (row) => (
        <div className="flex justify-center items-center space-x-4">
          <Link
            href={`/imoveis/${row.imovel_id}`}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </Link>
          <button
            onClick={() => {
              setSelectedImovel(row);
              setIsEditModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => {
              setSelectedImovel(row);
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

  const handlePageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page,
    }));
  };

  const handleDelete = async () => {
    if (!selectedImovel) return;
    await removeImovel(selectedImovel.imovel_id);
    setIsDeleteModalOpen(false);
  };

  const handleSaveEdit = async (id: number, data: UpdateImovelDto) => {
    await editImovel(id, data);
    setIsEditModalOpen(false);
  };

  const handleFilterChange = (datas: {
    dateStart: string;
    dateEnd: string;
  }) => {
    setDateStart(datas.dateStart);
    setDateEnd(datas.dateEnd);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Tabela de Imóveis" />
          <AddButton
            text="+ Adicionar"
            openModal={() => setIsAddModalOpen(true)}
          />
        </div>

        <Filters title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            <TextFilter
              label="Estado"
              placeholder="Ex: Alagoas"
              value={estadoFilter}
              onChange={setEstadoFilter}
            />
            <TextFilter
              label="Cidade"
              placeholder="Ex: Maceió"
              value={cidadeFilter}
              onChange={setCidadeFilter}
            />
          </div>
        </Filters>
        {!loading ? (
          <div className="w-full max-w-6xl mt-5">
            <Table data={imoveis ?? []} columns={columns} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Carregando imóveis...</p>
          </div>
        )}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <AddImovelModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={addImovel}
        />

        <EditImovelModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          imovel={selectedImovel}
        />

        <DeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Apagar Imóvel"
        >
          <p>
            Tem certeza que deseja apagar o imóvel em{" "}
            <strong>
              {selectedImovel?.rua}, {selectedImovel?.numero}
            </strong>
            ?
          </p>
        </DeleteModal>
      </div>
    </div>
  );
};

const ImoveisPage = () => {
  return (
    <PrivateRoute>
      <ImoveisPageContent />
    </PrivateRoute>
  );
};

export default ImoveisPage;
