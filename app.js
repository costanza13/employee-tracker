const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { Department, Role, Employee } = require('./models');

let db;
let department;
let role;

const actionPrompts = [
  {
    type: 'list',
    name: 'action',
    loop: false,
    message: 'What would you like to do?',
    loop: false,
    choices:
      [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        '__EXIT__'
      ]
  }
];

const newDepartmentPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of the new department? (leave blank to cancel)',
  }
];

const newRolePrompts = [
  {
    type: 'input',
    name: 'title',
    message: 'What is the title of the new role? (leave blank to cancel)',
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary for this role?',
    validate: salaryInput => {
      if (parseInt(salaryInput) === NaN) {
        console.log('Please enter a number for the salary.');
        return false;
      }
      return true;
    },
    when: ({ title }) => {
      return title.trim() !== '';
    }
  },
  {
    type: 'list',
    name: 'department',
    message: 'Which department does this role belong to?',
    choices: [],
    loop: false,
    when: ({ title }) => {
      return title.trim() !== '';
    }
  }
];

const newEmployeePrompts = [
  {
    type: 'input',
    name: 'firstName',
    message: "What is the new employee's first name? (leave blank to cancel)",
  },
  {
    type: 'input',
    name: 'lastName',
    message: "What is the employee's last name?",
    validate: lastNameInput => {
      if (lastNameInput.trim() === '') {
        console.log("Please enter a last name.");
        return false;
      }
      return true;
    },
    when: ({ firstName }) => {
      return firstName.trim() !== '';
    }
  },
  {
    type: 'list',
    name: 'role',
    message: "What is the employee's title?",
    choices: [],
    loop: false,
    when: ({ firstName }) => {
      return firstName.trim() !== '';
    }
  },
  {
    type: 'list',
    name: 'manager',
    message: 'Who does this employee report to?',
    choices: [],
    loop: false,
    default: 0,
    when: ({ firstName }) => {
      return firstName.trim() !== '';
    }
  }
];

function init() {
  console.log('');
  inquirer.prompt(actionPrompts)
    .then(actionData => {
      switch (actionData.action) {
        case 'View all departments':
          department.fetchAll()
            .then(departments => {
              console.log('\n' + cTable.getTable('Departments', departments));
              init();  // return to the action menu
            });
          break;

        case 'View all roles':
          role.fetchAll()
            .then(roles => {
              console.log('\n' + cTable.getTable('Roles', roles));
              init();  // return to the action menu
            });
          break;

        case 'View all employees':
          employee.fetchAll()
            .then(employees => {
              console.log('\n' + cTable.getTable('Employees', employees));
              init();  // return to the action menu
            });
          break;

        case 'Add a department':
          inquirer.prompt(newDepartmentPrompts)
            .then(departmentData => {
              if (departmentData.name !== '') {
                department.add(departmentData.name)
                  .then(({ message }) => {
                    console.log(`\n${message}`)
                    init();  // return to the action menu
                  });
              } else {
                init();
              }
            });
          break;

        case 'Add a role':
          department.fetchAll()
            .then(departments => {
              for (let i = 0; i < departments.length; i++) {
                newRolePrompts[2].choices.push({ name: departments[i].name, value: departments[i].id });
              }
              inquirer.prompt(newRolePrompts)
                .then(roleData => {
                  if (roleData.title !== '') {
                    role.add(roleData)
                      .then(({ message }) => {
                        console.log(`\n${message}`)
                        init();  // return to the action menu
                      });
                  } else {
                    init();  // return to the action menu
                  }
                });
            });
          break;

        case 'Add an employee':
          role.fetchAll()
            .then(roles => {
              for (let i = 0; i < roles.length; i++) {
                newEmployeePrompts[2].choices.push({ name: roles[i].title, value: roles[i].id });
              }
              employee.fetchAll()
                .then(managers => {
                  for (let i = 0; i < managers.length; i++) {
                    newEmployeePrompts[3].choices.push({ name: managers[i].first_name + ' ' + managers[i].last_name, value: managers[i].id });
                  }
                  newEmployeePrompts[3].choices.push({ name: '<none>', value: 0 });
                  inquirer.prompt(newEmployeePrompts)
                    .then(employeeData => {
                      if (employeeData.firstName !== '') {
                        employee.add(employeeData)
                          .then(({ message }) => {
                            console.log(`\n${message}`)
                            init();  // return to the action menu
                          });
                      } else {
                        init();  // return to the action menu
                      }
                    });
                });
            });
          break;

        case 'Update an employee role':
          console.log('action: ' + actionData.action);
          init();
          break;

        case '__EXIT__':
          process.exit(0);
      }
    })
    .catch(error => {
      console.log(error);
    });
}


mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'employees'
})
  .then(conn => {
    db = conn;

    department = new Department(db);
    role = new Role(db);
    employee = new Employee(db);

    console.log('Connected to employees database');
    init();
  });
