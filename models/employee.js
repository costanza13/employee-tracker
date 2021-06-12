class Employee {
  db;

  constructor(db) {
    this.db = db;
  }

  fetchAll() {
    return this.fetch({ filter: 'All' });
  }

  fetch(employeeData) {
    let sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,
                   IFNULL(CONCAT(m.first_name, ' ', m.last_name), '') AS manager
                 FROM employee e
                 LEFT JOIN role r ON r.id = e.role_id
                 LEFT JOIN department d ON d.id = r.department_id
                 LEFT JOIN employee m on m.id = e.manager_id`;
    const params = [];
    if (employeeData.filter === 'By manager') {
      if (employeeData.manager === 0) {
        sql += ' WHERE e.manager_id IS NULL';
      } else {
        sql += ' WHERE e.manager_id = ?';
        params.push(employeeData.manager);
      }
    } else if (employeeData.filter === 'By department') {
      sql += ' WHERE r.department_id = ?';
      params.push(employeeData.department);
    }
    return this.db.query(sql, params)
      .then(([rows, junk]) => {
        return rows;
      });
  }

  fetchManagers() {
    let sql = `SELECT m.id, m.first_name, m.last_name
               FROM employee e
               LEFT JOIN employee m on m.id = e.manager_id
               WHERE e.manager_id IS NOT NULL
               GROUP BY m.id`;
    return this.db.query(sql)
      .then(([rows, junk]) => {
        return rows;
      });
  }

  add({ first_name, last_name, role_id, manager_id }) {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    if (manager_id === 0) manager_id = null;
    const params = [first_name, last_name, role_id, manager_id];
    return this.db.query(sql, params)
      .then(([result, junk]) => {
        if (result.affectedRows) {
          return { status: 'success', message: `Added employee ${first_name} ${last_name}.` }
        } else {
          return { status: 'error', message: `Unable to add employee ${first_name} ${last_name}.` }
        }
        return result;
      })
      .catch(err => {
        return { status: 'error', message: `Unable to add employee ${first_name} ${last_name}. [ ${err} ]` }
      });
  }

  update({ id, role_id, manager_id }) {
    const sql = 'UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?';
    if (manager_id === 0) manager_id = null;
    const params = [role_id, manager_id, id]

    return this.db.query(sql, params)
      .then(([result, junk]) => {
        if (result.affectedRows) {
          return { status: 'success', message: `Updated employee ${id}.` }
        } else {
          return { status: 'error', message: `Unable to update employee ${id}.` }
        }
        return result;
      })
      .catch(err => {
        return { status: 'error', message: `Unable to update employee ${id}. [ ${err} ]` }
      });
  }

  delete(id) {
    return this.db.query('DELETE FROM employee WHERE id = ?', [id])
    .then(([result, junk]) => {
      if (result.affectedRows) {
        return { status: 'success', message: `Deleted employee ${id}.` }
      } else {
        return { status: 'error', message: `Unable to delete employee ${id}.` }
      }
      return result;
    })
    .catch(err => {
      return { status: 'error', message: `Unable to Delete employee ${id}. [ ${err} ]` }
  });
  }
};

module.exports = Employee;