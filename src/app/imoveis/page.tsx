"use client";

import React, { useMemo, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

// API
import {
  getImoveis,
  deleteImovel,
  createImovel,
  updateImovel,
  CreateImovelDto,
  UpdateImovelDto,
} from "@/services/imovelService";

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
    loading,
    error,
    addImovel,
    editImovel,
    removeImovel,
  } = useImoveis();

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);

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

  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return []; // proteção caso imoveis seja undefined ou null

    return imoveis.filter((imovel: Imovel) => {
      const data = imovel.data_cadastro.split("T")[0];
      if (dateStart && data < dateStart) return false;
      if (dateEnd && data > dateEnd) return false;
      return true;
    });
  }, [imoveis, dateStart, dateEnd]);

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

  if (loading) return <div>Carregando imóveis...</div>;
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
          <DataRangeFilter
            dateStart={dateStart}
            dateEnd={dateEnd}
            onFilterChange={handleFilterChange}
          />
        </Filters>

        <div className="w-full max-w-6xl mt-5">
          <Table data={imoveisFiltrados} columns={columns} />
        </div>

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
