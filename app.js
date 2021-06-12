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
        'View employees',
        'Add an employee',
        'Update an employee',
        'Delete an employee',
        'View all departments',
        'View department budget',
        'Add a department',
        'Delete a department',
        'View all roles',
        'Add a role',
        'Delete a role',
        '__EXIT__'
      ]
  }
];

function mainMenu() {
  console.log('');
  inquirer.prompt(mainPrompts)
    .then(actionData => {
      switch (actionData.action) {
        case 'View employees':
          Employees.viewEmployees(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add an employee':
          Employees.addEmployee(db).then(mainMenu);  // return to the action menu
          break;

        case 'Update an employee':
          Employees.updateEmployee(db).then(mainMenu);  // return to the action menu
          break;

        case 'Delete an employee':
          Employees.deleteEmployee(db).then(mainMenu);  // return to the action menu
          break;

        case 'View all departments':
          Departments.viewDepartments(db).then(mainMenu);  // return to the action menu
          break;

        case 'View department budget':
          Departments.viewBudget(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add a department':
          Departments.addDepartment(db).then(mainMenu);  // return to the action menu
          break;

        case 'Delete a department':
          Departments.deleteDepartment(db).then(mainMenu);  // return to the action menu
          break;

        case 'View all roles':
          Roles.viewRoles(db).then(mainMenu);  // return to the action menu
          break;

        case 'Add a role':
          Roles.addRole(db).then(mainMenu);  // return to the action menu
          break;

        case 'Delete a role':
          Roles.deleteRole(db).then(mainMenu);  // return to the action menu
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
