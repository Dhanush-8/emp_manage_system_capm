// By default the UI calls the same origin and Vite proxies /odata to the
// backend (see vite.config.js). Set VITE_API_URL only if the API lives on a
// different origin.
const API_BASE = import.meta.env.VITE_API_URL || '/odata/v4/employee';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch {
    throw new Error(
      'Could not reach the API. Make sure the backend is running (cds watch on port 4004).'
    );
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && body.error && body.error.message) {
        message = body.error.message;
      }
    } catch {
      // Response had no JSON body.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function listEmployees() {
  const data = await request('/Employees');
  return data.value ?? [];
}

export function createEmployee(employee) {
  return request('/Employees', {
    method: 'POST',
    body: JSON.stringify(employee),
  });
}

export function updateEmployee(id, employee) {
  return request(`/Employees(${id})`, {
    method: 'PATCH',
    body: JSON.stringify(employee),
  });
}

export function deleteEmployee(id) {
  return request(`/Employees(${id})`, { method: 'DELETE' });
}
