"use client";

import { useState, useMemo } from "react";
import { useClientes } from "@/hooks/useClientes";
import PrivateRoute from "@/components/privateRoute";
import PageTitle from "@/components/pagetitle";
import AddButton from "@/components/addButton";
import Table, { ColumDef } from "@/components/table";
import Pagination from "@/components/Pagination";
import EditClienteModal from "@/components/editClientModal";
import DeleteModal from "@/components/deleteModal";
import { FaPencilAlt, FaArchive, FaEye } from "react-icons/fa";
import { Cliente, UpdateClienteDto } from "@/services/clienteService";
import AddClienteModal from "@/components/addClienteModal";
import Filters from "@/components/filters";
import InterestFilter from "@/components/interestFilter";
import Link from "next/link";
import { toast } from "react-toastify";

const ClientesPageContent = () => {
  const {
    clientes,
    pagination,
    loading,
    error,
    handlePageChange,
    addCliente,
    removeCliente,
    editCliente,
    filters,
    setFilters,
  } = useClientes();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );

  const handleOpenEditModal = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: UpdateClienteDto) => {
    try {
      await editCliente(id, data);
    } catch (err) {
      throw err;
    } finally {
      setIsEditModalOpen(false);
      setClienteSelecionado(null);
    }
  };

  const handleConfirmarDelete = async () => {
    if (!clienteSelecionado) return;
    try {
      await removeCliente(clienteSelecionado.cliente_id);
      setIsDeleteModalOpen(false);
      setClienteSelecionado(null);
      toast.success("Cliente arquivado com sucesso!");
    } catch (err) {
      console.error("Erro ao apagar o cliente:", err);
      toast.error("Erro ao arquivar o cliente.");
    }
  };

  const columns: ColumDef<Cliente>[] = [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "telefone", header: "Telefone" },
    { accessorKey: "tipo_interesse", header: "Interesse" },
    {
      accessorKey: "data_cadastro",
      header: "Data de Cadastro",
      cell: (row) => new Date(row.data_cadastro).toLocaleDateString("pt-BR"),
    },
    {
      accessorKey: "cliente_id",
      header: "Ações",
      cell: (row) => (
        <div className="flex  space-x-4">
          <Link
            href={`/clientes/${row.cliente_id}`}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </Link>
          <button
            onClick={() => handleOpenEditModal(row)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => handleOpenDeleteModal(row)}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <FaArchive />
          </button>
        </div>
      ),
    },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Tabela de Clientes" />
          <AddButton
            text="+ Adicionar"
            openModal={() => {
              setIsAddModalOpen(true);
            }}
          />
        </div>

        <div className="mb-6">
          <Filters title="Filtros">
            <div className="flex flex-col md:flex-row gap-4">
              <InterestFilter
                value={filters.tipoInteresse}
                onChange={setFilters.setTipoInteresse}
              />
            </div>
          </Filters>
        </div>
        {!loading ? (
          <div className="w-full mt-5">
            <Table data={clientes} columns={columns} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Carregando clientes...</p>
          </div>
        )}

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <AddClienteModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={addCliente}
        />

        <EditClienteModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          cliente={clienteSelecionado}
          onSave={handleSaveEdit}
        />

        {clienteSelecionado && (
          <DeleteModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmarDelete}
            title="Arquivar Cliente"
          >
            <p>
              Tem a certeza que deseja arquivar o cliente{" "}
              <strong>{clienteSelecionado.nome}</strong>?
            </p>
          </DeleteModal>
        )}
      </div>
    </div>
  );
};

const ClientesPage = () => {
  return (
    <PrivateRoute>
      <ClientesPageContent />
    </PrivateRoute>
  );
};

export default ClientesPage;
