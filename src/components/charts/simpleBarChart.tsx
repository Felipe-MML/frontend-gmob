"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

interface SimpleBarChartProps {
  data: ChartDataItem[];
  xAxisKey: string;
  barKey: string;
  fill: string;
  colors?: string[];
}

const SimpleBarChart = ({
  data,
  xAxisKey,
  barKey,
  fill,
  colors,
}: SimpleBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill={fill} name={"Imóveis"}>
          {colors &&
            data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
