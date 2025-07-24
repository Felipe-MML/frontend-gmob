"use client";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="status-filter"
        className="text-sm font-medium text-gray-600 mb-1"
      >
        Status
      </label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">Todos</option>
        <option value="disponivel">Disponível</option>
        <option value="vendido">Vendido</option>
        <option value="alugado">Alugado</option>
      </select>
    </div>
  );
};

export default StatusFilter;
