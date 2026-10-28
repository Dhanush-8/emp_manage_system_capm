
using { company.Employees as EmployeeData } from '../db/schema';

service EmployeeService {
  entity Employees as projection on EmployeeData;
}
