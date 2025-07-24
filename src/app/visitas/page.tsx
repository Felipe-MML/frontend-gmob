"use client";

import { useState } from "react";
import { useVisitas } from "@/hooks/useVisitas";
import PrivateRoute from "@/components/privateRoute";
import PageTitle from "@/components/pagetitle";
import Table, { ColumDef } from "@/components/table";
import Pagination from "@/components/Pagination";
import { Visita } from "@/services/visitaService";
import { FaTrash, FaEye } from "react-icons/fa";
import Link from "next/link";
import DeleteModal from "@/components/deleteModal";

const VisitasPageContent = () => {
  const {
    visitas,
    pagination,
    loading,
    error,
    handlePageChange,
    removeVisita,
  } = useVisitas();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);

  const handleOpenDeleteModal = (visita: Visita) => {
    setSelectedVisita(visita);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVisita) return;
    try {
      await removeVisita(selectedVisita.agendamento_id);
      setIsDeleteModalOpen(false);
    } catch (err) {}
  };

  const columns: ColumDef<Visita>[] = [
    {
      header: "Cliente",
      accessorKey: "cliente",
      cell: (row) => row.cliente?.nome || `ID: ${row.cliente_id}`,
    },
    {
      header: "Corretor",
      accessorKey: "corretor",
      cell: (row) => row.corretor?.nome_completo || `ID: ${row.corretor_id}`,
    },
    {
      header: "Imóvel",
      accessorKey: "imovel",
      cell: (row) =>
        row.imovel
          ? `${row.imovel.rua}, ${row.imovel.numero}`
          : `ID: ${row.imovel_id}`,
    },
    {
      header: "Data da Visita",
      accessorKey: "data_visita",
      cell: (row) =>
        new Date(row.data_visita).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },

    {
      header: "Ações",
      accessorKey: "agendamento_id",
      cell: (row) => (
        <div className="flex space-x-4">
          <Link
            href={`/visitas/${row.agendamento_id}`}
            className="text-green-500 hover:text-green-700"
            title="Ver Detalhes"
          >
            <FaEye />
          </Link>
          <button
            onClick={() => handleOpenDeleteModal(row)}
            className="text-red-500 hover:text-red-700"
            title="Apagar Visita"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div>A carregar visitas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Tabela de Visitas Agendadas" />
        </div>

        <div className="w-full mt-5">
          <Table data={visitas} columns={columns} />
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {selectedVisita && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Apagar Agendamento de Visita"
          >
            <p>
              Tem a certeza que deseja apagar a visita do cliente{" "}
              <strong>{selectedVisita.cliente?.nome}</strong> para o dia{" "}
              <strong>
                {new Date(selectedVisita.data_visita).toLocaleDateString(
                  "pt-BR"
                )}
              </strong>
              ?
            </p>
          </DeleteModal>
        )}
      </div>
    </div>
  );
};

const VisitasPage = () => {
  return (
    <PrivateRoute>
      <VisitasPageContent />
    </PrivateRoute>
  );
};

export default VisitasPage;
