"use client";

import { useMemo } from "react";
import PageTitle from "@/components/pagetitle";
import PrivateRoute from "@/components/privateRoute";
import SimpleBarChart from "@/components/charts/simpleBarChart";
import { useMetricas } from "@/hooks/useMetricas";
import { useAuth } from "@/context/AuthContext";

const COLORS = ["#005eff", "#FFBB28", "#00C49F"];

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
        <p className="text-gray-600">Veja como estão suas métricas hoje:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Total de Imóveis</h3>
          <p className="text-3xl font-bold text-gray-800">{totalImoveis}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Total de Clientes</h3>
          <p className="text-3xl font-bold text-gray-800">
            {metricas.totalClientes}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">Total de Transações</h3>
          <p className="text-3xl font-bold text-gray-800">
            {metricas.totalTransacoes}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500">VGV (Valor Geral de Vendas)</h3>
          <p className="text-3xl font-bold text-gray-800">
            R$ {metricas.totalVendas.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Imóveis</h2>
        {chartData.length > 0 ? (
          <SimpleBarChart
            data={chartData}
            xAxisKey="name"
            barKey="Total"
            fill="#7367F0"
            colors={COLORS}
          />
        ) : (
          <p>Não há dados suficientes para exibir o gráfico.</p>
        )}
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
