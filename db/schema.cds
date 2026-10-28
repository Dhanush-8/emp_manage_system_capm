
namespace company;

entity Employees {
  key ID : Integer;
  name : String(100);
  department : String(50);
  salary : Decimal(10, 2);
}
