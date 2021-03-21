const pool = require('../utils/pool');

class Admin {
  id;
  email;
  passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email =  row.email;
    this.passwordHash = row.password_hash;
  }

  static async insert(admin) {
    const { rows } = await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *',
      [admin.email, admin.passwordHash]
    );

    return new Admin(rows[0]);
  }

  

}

module.exports = Admin; 
