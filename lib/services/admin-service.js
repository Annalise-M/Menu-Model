require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// style : OVERKILL SECURITY
const create = async({ email, password }) => {
  const passwordHash = await bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  
  return Admin.insert({ email, passwordHash });
};

const makeToken = admin => {
  const token = jwt.sign(admin.toJSON(), process.env.APP_SECRET, {
    expiresIn: '1d'
  });
  
  return token;
};

const authorize = async({ email, password }) => {
  const admin = await Admin.findByEmail(email);
  
  if(!admin) throw new Error('Invalid email/password');

  const passwordsMatch = await bcrypt.compareSync(password, admin.passwordHash);
  if(!passwordsMatch) throw new Error('Invalid email/password');

  return admin;
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
