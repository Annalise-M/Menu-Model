require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// style : OVERKILL SECURITY
const create = async({ email, password }) => {
  const passwordHash = await bcrypt.hash(password, process.env.SALT_ROUNDS);

  return Admin.insert({ email, passwordHash });
};

const authorize = async({ email, password }) => {
  const admin = await Admin.findByEmail(email);
  if(!admin) {
    const error = new Error('Invalid email/password');
    error.status = 401;
    throw error;
  }

  const passwordsMatch = await bcrypt.compare(password, admin.passwordHash);
  if(!passwordsMatch) {
    const error = new Error('Invalid email/password');
    error.status = 401;
    throw error;
  }

  return admin;
};

const makeToken = admin => {
  const token = jwt.sign(admin.toJSON(), process.env.APP_SECRET, {
    expiresIn: '1d'
  });

  return token;
};

const verifyToken = token => {
  const admin = jwt.verify(token, process.env.APP_SECRET);
  
  return admin;
};

module.exports = {
  create,
  authorize,
  makeToken,
  verifyToken
};
