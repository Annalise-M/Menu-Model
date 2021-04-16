const AdminService = require('../services/admin-service');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.session; 
    const payload = AdminService.verifyToken(token);

    req.admin = {
      id: payload.id,
      email: payload.email
    };
    next();
  } catch(error) {
    next(error);
  }
};
