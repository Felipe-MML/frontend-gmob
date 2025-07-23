"use cliente";

interface DataRangeFilterProps {
  dateStart: string;
  dateEnd: string;
  onFilterChange: (datas: { dateStart: string; dateEnd: string }) => void;
}

const DataRangeFilter: React.FC<DataRangeFilterProps> = ({
  dateStart,
  dateEnd,
  onFilterChange,
}) => {
  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ dateStart: e.target.value, dateEnd });
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ dateStart, dateEnd: e.target.value });
  };

  return (
    <div>
      <label
        htmlFor="interesse-filter"
        className="text-sm font-medium text-gray-600 mb-2"
      >
        Data
      </label>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <label>
            <span className="text-sm font-medium text-gray-600 mb-1">De:</span>
            <input
              type="date"
              id="dateStart"
              value={dateStart}
              onChange={handleDateStartChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </label>
        </div>
        <div className="flex flex-col">
          <label>
            <span className="text-sm font-medium text-gray-600 mb-1">Até:</span>
            <input
              type="date"
              id="dataFim"
              value={dateEnd}
              onChange={handleDateEndChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default DataRangeFilter;
