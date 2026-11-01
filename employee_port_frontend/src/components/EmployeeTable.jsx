export default function EmployeeTable({
  employees,
  loading,
  search,
  hasEmployees,
  onEdit,
  onDelete,
  onAdd,
  onClearSearch,
}) {
  if (loading) {
    return (
      <div className="table-wrap" aria-busy="true">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th className="align-right">Salary</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3].map((row) => (
              <tr key={row} className="skeleton-row">
                {[0, 1, 2, 3, 4].map((cell) => (
                  <td key={cell}>
                    <span className="skeleton" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon" aria-hidden="true">
          {hasEmployees ? '🔎' : '👥'}
        </div>
        <h3>{hasEmployees ? 'No matching employees' : 'No employees yet'}</h3>
        <p>
          {hasEmployees
            ? `Nothing matches “${search}”. Try a different search.`
            : 'Add your first employee to get started.'}
        </p>
        {hasEmployees ? (
          <button type="button" className="btn btn-ghost" onClick={onClearSearch}>
            Clear search
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onAdd}>
            + Add employee
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th className="align-right">Salary</th>
            <th className="align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.ID}>
              <td className="mono">#{employee.ID}</td>
              <td className="name-cell">{employee.name}</td>
              <td>
                <span className="badge">{employee.department}</span>
              </td>
              <td className="align-right mono">
                {Number(employee.salary || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="align-right">
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-small btn-ghost"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-danger-ghost"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
