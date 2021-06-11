class Department {
  db;

  constructor(db) {
    this.db = db;
  }

  fetchAll() {
    const sql = 'SELECT * FROM department';
    return this.db.query(sql)
      .then(([rows, junk]) => {
        return rows;
      });
  }

  add(name) {
    const sql = 'INSERT INTO department (name) VALUES (?)';
    return this.db.query(sql, [name])
      .then(([result, junk]) => {
        if (result.affectedRows) {
          return { status: 'success', message: `Added ${name} department.` }
        } else {
          return { status: 'error', message: `Unable to add ${name} department.` }
        }
        return result;
      })
      .catch(err => {
        return { status: 'error', message: `Unable to add ${name} department. [ ${err} ]` }
      });
  }
};


module.exports = Department;