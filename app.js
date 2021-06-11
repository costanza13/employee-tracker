const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { Department } = require('./models');

let db;

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
        'EXIT'
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

function init() {
  inquirer.prompt(actionPrompts)
    .then(actionData => {
      switch (actionData.action) {
        case 'View all departments':
          const department = new Department(db);
          department.fetchAll()
            .then(([rows, fields]) => {
              console.log('\n' + cTable.getTable('Departments', rows) + '\n');
              init();
            });
          break;

        case 'View all roles':
        case 'View all employees':
          console.log('action: ' + actionData.action);
          console.log('Fetch data from db...');
          init();
          break;

        case 'Add a department':
          inquirer.prompt(departmentPrompts)
            .then(departmentData => {
              if (departmentData !== '') {
                const department = new Department(db);
                department.add(departmentData.name)
                  .then(([result, junk]) => {
                    if (result.affectedRows) {
                      console.log(`\nAdded ${departmentData.name} department.\n`);
                    } else {
                      console.log(`\nUnable to add ${departmentData.name} department.\n`)
                    }
                    init();  // return to the action menu
                  })
                  .catch(err => {
                    console.log(`\nUnable to add ${departmentData.name} department. [ ${err} ]\n`)
                    init();  // return to the action menu
                  });
              } else {
                init();
              }
            });
          break;

        case 'Add a role':
        case 'Add an employee':
        case 'Update an employee':
          console.log('action: ' + actionData.action);
          init();
          break;

        case 'EXIT':
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
    init();
  });
