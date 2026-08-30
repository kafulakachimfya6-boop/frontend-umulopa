function Table({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold text-sm uppercase tracking-wide">
                {column.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 font-semibold text-sm uppercase tracking-wide">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="bg-white border border-gray-200 rounded-xl shadow-sm mb-2">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 align-top text-sm text-gray-700 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-4 align-top text-sm text-gray-700">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
