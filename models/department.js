class Department {
  db;

  constructor(db) {
    this.db = db;
  }

  fetchAll() {
    const sql = 'SELECT * FROM department';
    return this.db.query(sql);
  }

  add(name) {
    const sql = 'INSERT INTO department (name) VALUES (?)';
    return this.db.query(sql, [name]);
  }
};


module.exports = Department;