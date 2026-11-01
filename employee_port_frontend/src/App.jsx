import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee,
} from './api.js';
import Modal from './components/Modal.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setEmployees(await listEmployees());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(message, type = 'success') {
    setToast({ message, type });
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(term) ||
        employee.department?.toLowerCase().includes(term) ||
        String(employee.ID).includes(term)
    );
  }, [employees, search]);

  const stats = useMemo(() => {
    const departments = new Set(
      employees.map((employee) => employee.department).filter(Boolean)
    );
    const payroll = employees.reduce(
      (sum, employee) => sum + Number(employee.salary || 0),
      0
    );
    return {
      count: employees.length,
      departments: departments.size,
      payroll,
    };
  }, [employees]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(employee) {
    setEditing(employee);
    setFormOpen(true);
  }

  async function handleSave(payload) {
    if (editing) {
      await updateEmployee(editing.ID, payload);
      notify(`${payload.name} was updated.`);
    } else {
      await createEmployee(payload);
      notify(`${payload.name} was added.`);
    }
    setFormOpen(false);
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteEmployee(deleting.ID);
      notify(`${deleting.name} was deleted.`);
      setDeleting(null);
      await load();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setDeletingBusy(false);
    }
  }

  const existingIds = employees.map((employee) => employee.ID);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            EP
          </div>
          <div>
            <h1>Employee Portal</h1>
            <p>Manage your team in one place</p>
          </div>
        </div>
        <div className={`connection ${error ? 'is-offline' : 'is-online'}`}>
          <span className="dot" aria-hidden="true" />
          {error ? 'Disconnected' : 'Connected'}
        </div>
      </header>

      <main className="content">
        <section className="stats" aria-label="Summary">
          <article className="stat-card">
            <span className="stat-label">Employees</span>
            <strong className="stat-value">{stats.count}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Departments</span>
            <strong className="stat-value">{stats.departments}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Total payroll</span>
            <strong className="stat-value">{formatNumber(stats.payroll)}</strong>
          </article>
        </section>

        <section className="panel">
          <div className="toolbar">
            <div className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, department or ID"
                aria-label="Search employees"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <span aria-hidden="true">+</span> Add employee
            </button>
          </div>

          {error && (
            <div className="alert" role="alert">
              <div>
                <strong>Could not load employees.</strong>
                <p>{error}</p>
              </div>
              <button type="button" className="btn btn-ghost" onClick={load}>
                Retry
              </button>
            </div>
          )}

          <EmployeeTable
            employees={filtered}
            loading={loading}
            search={search}
            hasEmployees={employees.length > 0}
            onEdit={openEdit}
            onDelete={setDeleting}
            onAdd={openCreate}
            onClearSearch={() => setSearch('')}
          />
        </section>
      </main>

      {formOpen && (
        <Modal
          title={editing ? 'Edit employee' : 'Add employee'}
          onClose={() => setFormOpen(false)}
        >
          <EmployeeForm
            key={editing ? editing.ID : 'new'}
            employee={editing}
            existingIds={existingIds}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete employee" onClose={() => setDeleting(null)}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{deleting.name}</strong> (ID{' '}
            {deleting.ID})? This cannot be undone.
          </p>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setDeleting(null)}
              disabled={deletingBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deletingBusy}
            >
              {deletingBusy ? 'Deleting…' : 'Delete employee'}
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
