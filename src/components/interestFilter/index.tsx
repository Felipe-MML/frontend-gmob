"use client";

interface InterestFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const InterestFilter = ({ value, onChange }: InterestFilterProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="interesse-filter"
        className="text-sm font-medium text-gray-600 mb-1 "
      >
        Interesse
      </label>
      <select
        id="interesse-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">Todos</option>
        <option value="compra">Compra</option>
        <option value="aluguel">Aluguel</option>
      </select>
    </div>
  );
};

export default InterestFilter;
