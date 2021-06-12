const inquirer = require('inquirer');
const cTable = require('console.table');
const Role = require('../models/Role');

class Roles {
  static getPrompts(type, db) {
    const prompts = {
      add: [
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
          choices: answers => {
            const department = new Department(db);
            return department.fetchAll().then(departments => {
              return departments.map(d => { return { name: d.name, value: d.id } });
            });
          },
          loop: false,
          when: ({ title }) => {
            return title.trim() !== '';
          }
        }
      ],
    };
    return prompts[type];
  };

  static viewRoles = function (db) {
    const role = new Role(db);
    return role.fetchAll()
      .then(roles => {
        console.log('\n' + cTable.getTable('Roles', roles));
      });
  };

  static addRole = function (db) {
    const role = new Role(db);
    return inquirer.prompt(Roles.getPrompts('add', db))
      .then(roleData => {
        if (roleData.title !== '') {
          return role.add(roleData)
            .then(({ message }) => {
              console.log(`\n${message}`)
            });
        }
      });
  };
};

module.exports = Roles;