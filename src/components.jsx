// COMPONENTS.JSX — Componentes reutilizables
import React from "react";

export function DataTable({
  columns,
  data,
  getRowKey,
  searchPlaceholder = "Buscar...",
}) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((c) => {
        if (!c.accessor) return false;
        const val = c.accessor(row);
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [search, data, columns]);

  return (
    <div>
      <input
        className="input"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.id || c.label}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  Sin datos
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((c) => (
                    <td key={c.id || c.label}>
                      {c.render ? c.render(row) : c.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
