
function checkRole(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden: Only admins can do this action');
  }
}

module.exports = checkRole;