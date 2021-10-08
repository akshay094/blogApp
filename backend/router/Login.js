// require('dotenv').config();

const express = require('express');
const Login = new express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../helper/auth')

// User login
Login.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = await pool.query(
      "select * from buser where email=$1", [email]
    );

    if (login.rows.length) {
      // compare the hashed password with the entered password
      const compare = await bcrypt.compare(password, login.rows[0].password);

      if (compare) {
        const payload = {
          user: {
            user_id: login.rows[0].user_id,
            email: email
          }
        }
        jwt.sign(
          payload,
          'secretKey',
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err
            return res.status(200).json({ token });
          });
      } else {
        return res.status(401).json({ status: false, message: "Incorrect Username/Password" })
      }
    } else {
      return res.status(401).json({ status: false, message: "Incorrect Username/Password" })
    }
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = Login;