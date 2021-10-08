const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: "No token , authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token not valid" })
  }
}