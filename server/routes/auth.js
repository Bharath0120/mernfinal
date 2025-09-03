const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// register
router.post('/register', async (req,res)=>{
  const { email, password, name } = req.body;
  if(!email || !password) return res.status(400).json({error:'email+password required'});
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({error:'User exists'});
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, user: { email: user.email, name: user.name, role: user.role }});
});

// login
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({error:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({error:'Invalid credentials'});
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, user: { email: user.email, name: user.name, role: user.role }});
});

module.exports = router;
