"use client";

import { useState, useMemo } from "react";
import { useClientes } from "@/hooks/useClientes";
import PrivateRoute from "@/components/privateRoute";
import PageTitle from "@/components/pagetitle";
import AddButton from "@/components/addButton";
import Table, { ColumDef } from "@/components/table";
import Pagination from "@/components/Pagination";
// Importe ou crie os modais para clientes (pode duplicar e adaptar os de corretores)
// import EditClienteModal from '@/components/EditClienteModal';
// import DeleteModal from '@/components/deleteModal';
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Cliente } from "@/services/clienteService";
import AddClienteModal from "@/components/addClienteModal";

const ClientesPageContent = () => {
  const { clientes, pagination, loading, error, handlePageChange, addCliente } =
    useClientes();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Defina as colunas para a tabela de clientes
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
        <div className="flex justify-center items-center space-x-4">
          <button className="text-blue-500 hover:text-blue-700">
            <FaPencilAlt />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div>A carregar clientes...</div>;
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

        {/* Aqui você pode adicionar os filtros se desejar */}

        <div className="w-full mt-5">
          <Table data={clientes} columns={columns} />
        </div>

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
