const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');



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
          console.log('action: ' + actionData.action);
          console.log('Fetch department data');
          init();
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
              console.log('Store new department', departmentData);
              init();  // return to the action menu
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

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');

  init();
});
