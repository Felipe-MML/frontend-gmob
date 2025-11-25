import { ReactNode } from "react";

export interface ColumDef<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: ColumDef<T>[];
}

const Table = <T extends object>({ data, columns }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
        <thead className="text-left">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className="whitespace-nowrap px-4 py-3 font-medium text-gray-500 uppercase"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${String(column.accessorKey)}`}
                  className="whitespace-nowrap px-4 py-3 text-gray-700"
                >
                  {column.cell
                    ? column.cell(row)
                    : String(row[column.accessorKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
