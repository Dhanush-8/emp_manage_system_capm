import { useState } from 'react';

export default function EmployeeForm({
  employee,
  existingIds,
  onSave,
  onCancel,
}) {
  const isEdit = Boolean(employee);
  const [values, setValues] = useState({
    ID: employee ? String(employee.ID) : '',
    name: employee?.name ?? '',
    department: employee?.department ?? '',
    salary: employee ? String(employee.salary) : '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next = {};

    if (!isEdit) {
      const id = Number(values.ID);
      if (values.ID === '' || !Number.isInteger(id) || id <= 0) {
        next.ID = 'Enter a positive whole number.';
      } else if (existingIds.includes(id)) {
        next.ID = 'This ID is already in use.';
      }
    }

    if (!values.name.trim()) {
      next.name = 'Name is required.';
    } else if (values.name.trim().length > 100) {
      next.name = 'Name must be 100 characters or fewer.';
    }

    if (!values.department.trim()) {
      next.department = 'Department is required.';
    } else if (values.department.trim().length > 50) {
      next.department = 'Department must be 50 characters or fewer.';
    }

    const salary = Number(values.salary);
    if (values.salary === '' || Number.isNaN(salary) || salary < 0) {
      next.salary = 'Enter a valid salary of 0 or more.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    if (!validate()) return;

    const payload = {
      name: values.name.trim(),
      department: values.department.trim(),
      salary: Number(values.salary),
    };
    if (!isEdit) payload.ID = Number(values.ID);

    setSubmitting(true);
    try {
      await onSave(payload);
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="employee-id">Employee ID</label>
        <input
          id="employee-id"
          type="number"
          min="1"
          step="1"
          value={values.ID}
          onChange={(event) => update('ID', event.target.value)}
          disabled={isEdit}
          placeholder="e.g. 101"
          aria-invalid={Boolean(errors.ID)}
        />
        {isEdit ? (
          <small className="hint">The ID cannot be changed.</small>
        ) : (
          errors.ID && <small className="error-text">{errors.ID}</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="employee-name">Full name</label>
        <input
          id="employee-name"
          type="text"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="e.g. Ada Lovelace"
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small className="error-text">{errors.name}</small>}
      </div>

      <div className="field">
        <label htmlFor="employee-department">Department</label>
        <input
          id="employee-department"
          type="text"
          value={values.department}
          onChange={(event) => update('department', event.target.value)}
          placeholder="e.g. Engineering"
          maxLength={50}
          aria-invalid={Boolean(errors.department)}
        />
        {errors.department && (
          <small className="error-text">{errors.department}</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="employee-salary">Salary</label>
        <input
          id="employee-salary"
          type="number"
          min="0"
          step="0.01"
          value={values.salary}
          onChange={(event) => update('salary', event.target.value)}
          placeholder="e.g. 50000"
          aria-invalid={Boolean(errors.salary)}
        />
        {errors.salary && <small className="error-text">{errors.salary}</small>}
      </div>

      {formError && (
        <div className="form-error" role="alert">
          {formError}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add employee'}
        </button>
      </div>
    </form>
  );
}
