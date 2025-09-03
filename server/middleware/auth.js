const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET) throw new Error('JWT_SECRET missing');

async function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'No auth header'});
  const token = h.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if(!user) return res.status(401).json({error:'User not found'});
    req.user = user;
    next();
  } catch(e) {
    return res.status(401).json({error:'Invalid token'});
  }
}

module.exports = { authMiddleware };
