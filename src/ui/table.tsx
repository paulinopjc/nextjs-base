import React from 'react';

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column<T>[];
  mobileRender: (row: T) => React.ReactNode;
};

export default function Table<T extends Record<string, unknown>>({
  data,
  columns,
  mobileRender,
}: TableProps<T>) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile */}
          <div className="md:hidden space-y-2">
            {data.map((row, i) => (
              <div key={i} className="rounded-md bg-white p-4">
                {mobileRender(row)}
              </div>
            ))}
          </div>

          {/* Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className="px-4 py-5 font-medium sm:pl-6"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              {data.map((row, i) => (
                <tr key={i} className="border-b last-of-type:border-none">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="whitespace-nowrap px-4 py-3 sm:pl-6"
                    >
                      {col.render ? col.render(row) : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
