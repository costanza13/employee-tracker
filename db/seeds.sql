INSERT INTO department (name) VALUES ('Sales'), ('IT'), ('Engineering');

INSERT INTO role (title, salary, department_id)
  VALUES ('Account Manager', 250000, 1),
         ('Sales Associate', 75000, 1),
         ('IT Manager', 175000, 2),
         ('Systems Admin', 120000, 2),
         ('Tech', 50000, 2),
         ('Lead Engineer', 190000, 3),
         ('SE', 150000, 3),
         ('SSE', 175000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES ('Michael', 'Costanza', 6, NULL),
         ('Adam', 'Adamson', 8, 1),
         ('Boss', 'Hogg', 1, NULL),
         ('Sam', 'Sampson', 2, 3);
