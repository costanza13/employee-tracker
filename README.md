# Employee Tracker

## Description
A tool for business owners to help organize and plan their business. The app presents a command-line interface for managing departments, roles and employees.

## Features

* Upon start-up, the application presents a menu with options to view, edit or delete Employees, Roles, and Departments.
* Selecting "View employees" gives the user the option to view All employees, show employees for a specific Manager, or show employees in a specific Department.  Results are presented in a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and manager that each employee reports to.
* "Add an employee" prompts the user to enter the employee’s first name, last name, role, and manager and that employee is added to the database
* "Update an employee" gives the user the option to update the employee's role or manager.
* "Delete an employee" lets the user choose the employee to delete (after confirmation).
* "View departments" presents the user with a formatted table showing department names and department ids.
* "View department budget" allows the user to view a table of the department details, including the total utilized budget, calculated from the salaries of all employees in the department.
* "Add a department" prompts the user for the name of the department.
* "Delete a department" lets the user choose the department to delete (after confirmation).
* "View roles" displays a table with the job title, role id, the department each role belongs to, and the salary for each role.
* "Add a role" prompts the user for the name, salary, and department for the role.
* "Delete a role" lets the user choose the role to delete (after confirmation).
* Data is recorded in a MySQL database and persists between sessions.

## Installation
1) Make sure you're running a recent version of [Node.js](https://nodejs.org/en/) (built on v14.16.1)
2) Clone the repository at https://github.com/costanza13/employee-tracker
3) Run `npm install` in the project root directory
4) Make sure you have MySQL installed
5) Copy/rename the sample `.env.sample` file to `.env` and replace the values with your MySQL connection details
6) Run the following to create the `employee` database and necessary tables:
  > `mysql -u <db_user> -p db/schem.sql`

## Running Employee Tracker
- Run `npm start` from the project's root directory and follow the prompts

<a href="https://drive.google.com/file/d/11fubtKaMKefzTx1AaVVv9h135qX6FlzD/view?usp=sharing"><img src="./assets/images/Employee-Tracker-Demo.gif"></a>


## Technologies Used
* Node.js
* MySQL

## Credits

This app uses the following very helpful NPM packages:
- [Inqiurer.js](https://github.com/SBoudrias/Inquirer.js)
- [Node MySQL 2](https://github.com/sidorares/node-mysql2)
- [console.table](https://github.com/bahmutov/console.table)
- [dotenv](https://github.com/motdotla/dotenv)

Hat-tip to [Manytools](<a href="https://manytools.org/hacker-tools/ascii-banner/"></a>) for the cool ASCII banner creator.

## Links
* GitHub: [Employee Tracker](https://github.com/costanza13/employee-tracker)
* [Demo video](https://drive.google.com/file/d/11fubtKaMKefzTx1AaVVv9h135qX6FlzD/view?usp=sharing)
