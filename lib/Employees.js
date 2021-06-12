const inquirer = require('inquirer');
const cTable = require('console.table');
const Employee = require('../models/Employee');
const Role = require('../models/Role');

class Employees {

  static getPrompts(type, db) {
    const prompts = {
      add: [
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
          choices: answers => {
            const role = new Role(db);
            return role.fetchAll().then(roles => {
              return roles.map(r => { return { name: r.title, value: r.id } });
            });
          },
          loop: false,
          when: ({ firstName }) => {
            return firstName.trim() !== '';
          }
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who does this employee report to?',
          choices: answers => {
            const employee = new Employee(db);
            return employee.fetchAll().then(managers => {
              return managers.map(m => { return { name: m.first_name + ' ' + m.last_name, value: m.id } });
            });
          },
          loop: false,
          default: 0,
          when: ({ firstName }) => {
            return firstName.trim() !== '';
          }
        }
      ],

      update: [
        {
          type: 'list',
          name: 'employee',
          message: "Which employee would you like to update?",
          loop: false,
          choices: answers => {
            const employee = new Employee(db);
            return employee.fetchAll().then(employees => {
              let choices = employees.map(e => { return { name: e.first_name + ' ' + e.last_name, value: e.id } });
              choices.push({ name: '__CANCEL__', value: 0 });
              return choices;
            });
          },
          when: ({ employee }) => {
            return employee !== 0;
          }
        },
        {
          type: 'list',
          name: 'role',
          message: "Select the employee's new role:",
          loop: false,
          choices: answers => {
            const role = new Role(db);
            return role.fetchAll().then(roles => {
              return roles.map(r => { return { name: r.title, value: r.id } });
            });
          },
          when: ({ employee }) => {
            return employee !== 0;
          }
        },
        {
          type: 'list',
          name: 'manager',
          message: "Select the employee's new manager:",
          loop: false,
          choices: answers => {
            const employee = new Employee(db);
            return employee.fetchAll().then(managers => {
              return managers.map(m => { return { name: m.first_name + ' ' + m.last_name, value: m.id } });
            });
          },
          when: ({ employee }) => {
            return employee !== 0;
          },
          default: 0
        }
      ]
    };
    return prompts[type];
  };

  static viewEmployees = function (db) {
    const employee = new Employee(db);
    return employee.fetchAll()
      .then(employees => {
        console.log('\n' + cTable.getTable('Employees', employees));
      });
  };

  static addEmployee = function (db) {
    const employee = new Employee(db);
    return inquirer.prompt(Employees.getPrompts('add', db))
      .then(employeeData => {
        if (employeeData.firstName !== '') {
          return employee.add({ first_name: employeeData.firstName, last_name: employeeData.lastName, role_id: employeeData.role, manager_id: employeeData.manager })
            .then(({ message }) => {
              console.log(`\n${message}`)
            });
        }
      });
  };

  static updateEmployee = function (db) {
    const employee = new Employee(db);
    return inquirer.prompt(Employees.getPrompts('update', db))
      .then(employeeData => {
        if (employeeData.employee !== 0) {
          return employee.update({ id: employeeData.employee, role_id: employeeData.role, manager_id: employeeData.manager })
            .then(({ message }) => {
              console.log(`\n${message}`)
            });
        }
      });
  };
};

module.exports = Employees;