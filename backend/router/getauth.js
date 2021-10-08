const express = require('express')
const jwt = require('jsonwebtoken');
const getAuth = new express.Router()
const pool = require('../db');

getAuth.post('/auth', async (req, res) => {
  const token = req.header('x-auth-token');
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token , authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    return res.status(200).send(decoded.user)
  } catch (error) {
    return res.status(401).json({ message: "Token not valid" })
  }
})

getAuth.post('/adminauth', async (req, res) => {
  const token = req.header('x-auth-token');
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token , authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, 'secretKey');
    const adUser = await pool.query("select * from buser where user_id=$1 and user_type='1'", [decoded.user.user_id]);
    if (adUser.rows.length) {
      return res.status(200).send(decoded.user)
    } else {
      return res.status(401).send({ message: "Invalid Credentials" })
    }
  } catch (error) {
    return res.status(401).json({ message: "Token not valid" })
  }
})

module.exports = getAuth;