const pool = require('../utils/pool');

module.exports = class Admin {
  id;
  email;
  passwordHash;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async insert(admin) {
    const { rows } = await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *',
      [admin.email, admin.passwordHash]
    );

    return new Admin(rows[0]);
  }

  
  static async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM admins WHERE email=$1',
      [email]
    );
      
    if(!rows[0]) return null;
    else return new Admin(rows[0]);
  }
    
  toJSON() {
    return {
      id: this.id,
      email: this.email,
    };
  }
};
