"use client";

import { useMemo } from "react";
import PageTitle from "@/components/pagetitle";
import PrivateRoute from "@/components/privateRoute";
import SimpleBarChart from "@/components/charts/simpleBarChart";
import { Progress } from "@/components/ui/progress";
import { useMetricas } from "@/hooks/useMetricas";
import { useAuth } from "@/context/AuthContext";
import {
  FaBuilding,
  FaUsers,
  FaHandshake,
  FaDollarSign,
} from "react-icons/fa6";

const COLORS = ["#6495ED", "#40E0D0", "#9370DB"];

const DashboardPageContent = () => {
  const { metricas, loading, error } = useMetricas();
  const { user } = useAuth();

  const chartData = useMemo(() => {
    if (!metricas) return [];

    return [
      { name: "Disponíveis", Total: metricas.imoveisDisponiveis },
      { name: "Alugados", Total: metricas.imoveisAlugados },
      { name: "Vendidos", Total: metricas.imoveisVendidos },
    ];
  }, [metricas]);

  const totalImoveis = useMemo(() => {
    if (!metricas) return 0;
    return (
      metricas.imoveisDisponiveis +
      metricas.imoveisAlugados +
      metricas.imoveisVendidos
    );
  }, [metricas]);

  if (loading) return <div>A carregar métricas...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!metricas) return <div>Não há dados de métricas para exibir.</div>;

  return (
    <div className="w-full space-y-8">
      <div>
        <PageTitle
          title={`BEM VINDO, ${user?.nome_completo
            .split(" ")[0]
            .toUpperCase()}!`}
        />
        <p className="font-semibold text-gray-600">
          Acompanhe o desempenho dos seus imóveis:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md w-auto">
          <div>
            <h3 className="text-gray-500 mb-2">Total de Imóveis</h3>
            <p className="text-3xl font-bold text-gray-800">{totalImoveis}</p>
          </div>
          <div className="bg-blue-200 p-4 rounded-2xl">
            <FaBuilding className="text-3xl text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 mb-2">Total de Clientes</h3>
              <p className="text-3xl font-bold text-gray-800">
                {metricas.totalClientes}
              </p>
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <FaUsers className="text-3xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 mb-2">Total de Transações</h3>
              <p className="text-3xl font-bold text-gray-800">
                {metricas.totalTransacoes}
              </p>
            </div>
            <div className="bg-purple-200 p-4 rounded-2xl">
              <FaHandshake className="text-3xl text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 mb-2">Total de Vendas</h3>
              <p className="text-3xl font-bold text-gray-800">
                R$ {metricas.totalVendas.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-2xl">
              <FaDollarSign className="text-3xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 mb-2">Comissão de Vendas</h3>
              <p className="text-3xl font-bold text-gray-800">
                R$ {metricas.comissaoVendas.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-2xl">
              <FaDollarSign className="text-3xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 mb-2">Comissão de Aluguéis</h3>
              <p className="text-3xl font-bold text-gray-800">
                R$ {metricas.comissaoAluguel.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-2xl">
              <FaDollarSign className="text-3xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-10">
        <div className="flex flex-col gap-20 bg-white p-6 rounded-lg shadow-md w-1/2 h-125">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Status dos Imóveis
          </h2>
          {chartData.length > 0 ? (
            <div className="flex self-center sm:w-150 w-75">
              <SimpleBarChart
                data={chartData}
                xAxisKey="name"
                barKey="Total"
                fill="#ffffff"
                colors={COLORS}
              />
            </div>
          ) : (
            <p>Não há dados suficientes para exibir o gráfico.</p>
          )}
        </div>
        <div className="flex flex-col gap-5 bg-white p-6 rounded-lg shadow-md w-150 h-125">
          <h2 className="text-2xl font-bold text-gray-700">
            Resumo por categoria
          </h2>
          <div className="flex items-center justify-between bg-gray-300 h-20 rounded-3xl p-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
              <p className="font-semibold">Disponíveis</p>
            </div>
            <h4 className="text-3xl mr-5 font-bold">
              {metricas.imoveisDisponiveis}
            </h4>
          </div>
          <div className="flex items-center justify-between bg-gray-300 h-20 rounded-3xl p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 w-3 h-3 rounded-full"></div>
              <p className="font-semibold">Alugados</p>
            </div>
            <h4 className="text-3xl mr-5 font-bold">
              {metricas.imoveisAlugados}
            </h4>
          </div>
          <div className="flex items-center justify-between bg-gray-300 h-20 rounded-3xl p-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 w-3 h-3 rounded-full"></div>
              <p className="font-semibold">Vendidos</p>
            </div>
            <h4 className="text-3xl mr-5 font-bold">
              {metricas.imoveisVendidos}
            </h4>
          </div>
          <hr />
          <div className="flex justify-between">
            <p className="font-semibold">Vendas e aluguéis:</p>
            <p className="font-semibold">
              {(
                ((metricas.imoveisVendidos + metricas.imoveisAlugados) /
                  totalImoveis) *
                100
              ).toFixed(1) || 0}
              %
            </p>
          </div>
          <Progress
            value={
              ((metricas.imoveisVendidos + metricas.imoveisAlugados) /
                totalImoveis) *
                100 || 0
            }
            className="h-6 rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <PrivateRoute>
      <DashboardPageContent />
    </PrivateRoute>
  );
};

export default DashboardPage;
