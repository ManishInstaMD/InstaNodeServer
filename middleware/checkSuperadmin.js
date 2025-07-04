// middleware/checkSuperadmin.js
module.exports = function checkSuperadmin(req, res, next) {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Only superadmin allowed.' });
  }
  next();
};
