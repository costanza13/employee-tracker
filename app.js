const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { Department, Role } = require('./models');

let db;
let department;
let role;

const actionPrompts = [
  {
    type: 'list',
    name: 'action',
    loop: false,
    message: 'What would you like to do?',
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

const departmentPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of the new department? (leave blank to cancel)',
  }
];

const rolePrompts = [
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
    when: ({ title }) => {
      return title.trim() !== '';
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
              init();
            });
          break;

        case 'View all roles':
          role.fetchAll()
            .then(roles => {
              console.log('\n' + cTable.getTable('Roles', roles));
              init();
            });
          break;

        case 'View all employees':
          console.log('action: ' + actionData.action);
          console.log('Fetch data from db...');
          init();  // return to the action menu
          break;

        case 'Add a department':
          inquirer.prompt(departmentPrompts)
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
                rolePrompts[2].choices.push({ name: departments[i].name, value: departments[i].id });
              }
              inquirer.prompt(rolePrompts)
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
            })
          break;

        case 'Add an employee':
        case 'Update an employee':
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

    console.log('Connected to employees database');
    init();
  });
