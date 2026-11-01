# Employee Portal - React Frontend

React (Vite) UI for the Employee Portal CAP backend. It talks only to the
existing `EmployeeService` OData API — no backend changes required.

## API used

```
GET    /odata/v4/employee/Employees
POST   /odata/v4/employee/Employees
PATCH  /odata/v4/employee/Employees(ID)
DELETE /odata/v4/employee/Employees(ID)
```

The base URL defaults to `http://localhost:4004/odata/v4/employee`. To point at
another server, copy `.env.example` to `.env` and change `VITE_API_URL`.

## Structure

```
employee_port_frontend/
├── index.html
├── vite.config.js
└── src/
    ├── api.js               # OData calls (list/create/update/delete)
    ├── App.jsx              # Page state, search, stats, dialogs
    ├── main.jsx             # Entry point
    ├── styles.css
    └── components/
        ├── EmployeeForm.jsx # Add / edit form with validation
        ├── EmployeeTable.jsx
        └── Modal.jsx
```

## Getting started

Start the backend first (from `employee_port_backend`):

```bash
cds watch
```

Then start the UI (from `employee_port_frontend`):

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Features

- List employees with ID, name, department and salary
- Add, edit and delete employees
- Client-side validation (required fields, duplicate ID, salary >= 0)
- Search by name, department or ID
- Summary cards (employee count, departments, total payroll)
- Loading, empty, error and toast states

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```
