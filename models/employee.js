class Employee {
  db;

  constructor(db) {
    this.db = db;
  }

  fetchAll() {
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,
                   IFNULL(CONCAT(m.first_name, ' ', m.last_name), '') AS manager
                 FROM employee e
                 LEFT JOIN role r ON r.id = e.role_id
                 LEFT JOIN department d ON d.id = r.department_id
                 LEFT JOIN employee m on m.id = e.manager_id`;
    return this.db.query(sql)
    .then(([rows, junk]) => {
      return rows;
    });
  }

  add(employeeData) {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    if (employeeData.manager === 0) employeeData.manager = null;
    const params = [employeeData.firstName, employeeData.lastName, employeeData.role, employeeData.manager];
    return this.db.query(sql, params)
    .then(([result, junk]) => {
      if (result.affectedRows) {
        return { status: 'success', message: `Added employee ${employeeData.firstName} ${employeeData.lastName}.`}
      } else {
        return { status: 'error', message: `Unable to add employee ${employeeData.firstName} ${employeeData.lastName}.`}
      }
      return result;
    })
    .catch(err => {
      return { status: 'error', message: `Unable to add employee ${employeeData.firstName} ${employeeData.lastName}. [ ${err} ]`}
    });
  }
};


module.exports = Employee;