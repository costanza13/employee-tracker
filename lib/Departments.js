const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('../models/Department');

class Departments {
  static getPrompts(type, db) {
    const prompts = {
      add: [
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the new department? (leave blank to cancel)',
        }
      ],
      budget: [
        {
          type: 'list',
          name: 'department',
          message: "Which department's budget would you like to see?",
          loop: false,
          choices: answers => {
            const department = new Department(db);
            return department.fetchAll().then(departments => {
              return departments.map(d => { return { name: d.name, value: d.id } });
            });
          }
        }
      ],

      delete: [
        {
          type: 'list',
          name: 'department',
          message: "Which department do you want to delete?",
          loop: false,
          choices: answers => {
            const department = new Department(db);
            return department.fetchAll().then(departments => {
              const departmentsArray = departments.map(d => { return { name: d.name, value: d.id } });
              departmentsArray.push({ name: '__CANCEL__', id: 0 });
              return departmentsArray;
            });
          },
          default: 0
        },
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: 'Are you sure?',
          default: false,
          when: ({ department }) => {
            return department !== 0;
          }
        }
      ]
    };
    return prompts[type];
  };

  static viewDepartments = function (db) {
    const department = new Department(db);
    return department.fetchAll()
      .then(departments => {
        console.log('\n' + cTable.getTable('Departments', departments));
      });
  };

  static addDepartment = function (db) {
    const department = new Department(db);
    return inquirer.prompt(Departments.getPrompts('add', db))
      .then(departmentData => {
        if (departmentData.name !== '') {
          return department.add(departmentData.name)
            .then(({ message }) => {
              console.log(`\n${message}`)
            });
        }
      });
  };

  static deleteDepartment = function (db) {
    const department = new Department(db);
    return inquirer.prompt(Departments.getPrompts('delete', db))
      .then(departmentData => {
        if (departmentData.department !== 0 && departmentData.confirmDelete) {
          return department.delete(departmentData.department)
            .then(({ message }) => {
              console.log(`\n${message}`)
            });
        }
      });
  };

  static viewBudget = function (db) {
    const department = new Department(db);
    return inquirer.prompt(Departments.getPrompts('budget'))
      .then(departmentData => {
        department.showBudget(departmentData.department)
        .then(departments => {
          console.log('\n' + cTable.getTable('Departments', departments));
        });
      });
  };
};

module.exports = Departments;
