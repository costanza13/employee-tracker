class Role {
  db;

  constructor(db) {
    this.db = db;
  }

  fetchAll() {
    const sql = 'SELECT r.id, r.title, r.salary, d.name FROM role r LEFT JOIN department d ON d.id = r.department_id';
    return this.db.query(sql)
    .then(([rows, junk]) => {
      return rows;
    });
  }

  add(roleData) {
    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const params = [roleData.title, roleData.salary, roleData.department];
    return this.db.query(sql, params)
    .then(([result, junk]) => {
      if (result.affectedRows) {
        return { status: 'success', message: `Added ${roleData.title} role.`}
      } else {
        return { status: 'error', message: `Unable to add ${roleData.title} role.`}
      }
      return result;
    })
    .catch(err => {
      return { status: 'error', message: `Unable to add ${roleData.title} role. [ ${err} ]`}
    });
  }
};


module.exports = Role;