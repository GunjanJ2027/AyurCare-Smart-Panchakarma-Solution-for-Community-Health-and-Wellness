const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from header
  let token = req.header('x-auth-token') || req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Clean the token if it has 'Bearer ' prefix
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  // 2. Verify normal tokens against your secret key
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ayurcare_super_secret_key_for_midterm');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};