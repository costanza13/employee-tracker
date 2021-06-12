const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { Departments, Roles, Employees } = require('./lib');

let db;

const mainPrompts = [
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
        'Update an employee',
        '__EXIT__'
      ]
  }
];

function mainMenu() {
  console.log('');
  inquirer.prompt(mainPrompts)
    .then(actionData => {
      switch (actionData.action) {
        case 'View all departments':
          Departments.viewDepartments(db).then(mainMenu);  // return to the action menu
          break;

        case 'View all roles':
          Roles.viewRoles(db).then(mainMenu);  // return to the action menu
          break;

        case 'View all employees':
          Employees.viewEmployees(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add a department':
          Departments.addDepartment(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add a role':
          Roles.addRole(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add an employee':
          Employees.addEmployee(db).then(mainMenu);  // return to the action menu
          break;

        case 'Update an employee':
          Employees.updateEmployee(db).then(mainMenu);  // return to the action menu
          break;

        case '__EXIT__':
          console.log('\nHave a nice day!\n');
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
    console.log('Connected to employees database');
    mainMenu();
  });
