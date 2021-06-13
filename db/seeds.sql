INSERT INTO department (name)
  VALUES ('Engineering'),
         ('Finance'),
         ('IT'),
         ('Marketing'),
         ('Sales'),
         ('CEO');

INSERT INTO role (title, salary, department_id)
  VALUES ('Account Manager', 150000, 5),
         ('Sales Associate', 85000, 5),
         ('Post-Sales Support', 75000, 5),
         ('Product Manager', 140000, 4),
         ('Accountant', 120000, 2),
         ('Bookeeper', 90000, 2),
         ('IT Manager', 175000, 3),
         ('Systems Admin', 120000, 3),
         ('IT Tech', 50000, 3),
         ('Engineering Manager', 175000, 1),
         ('Software Engineer', 150000, 1),
         ('Associate Software Engineer', 175000, 1),
         ('CEO', 8500000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES ('Bossie', 'Bossipants', 12, NULL),
         ('John', 'Wu', 10, 1),
         ('Sally', 'Struthers', 1, 1),
         ('Mindy', 'Cohn', 7, 2),
         ('Jim', 'Beam', 5, 1),
         ('Tara', 'Vipusithamakool', 8, 4),
         ('Wanda', 'Minimov', 4, 1),
         ('Barry', 'White', 2, 3),
         ('Wilma', 'Flintstone', 6, 5),
         ('Sam', 'Sampson', 9, 4);
