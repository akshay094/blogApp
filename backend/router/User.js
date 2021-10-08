const express = require('express');
const User = new express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const auth = require('../helper/auth')


// create new user
User.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await pool.query(
      "select email from buser where email=$1", [email]
    );
    if (exists.rows.length) {
      return res.status(422).json({ message: 'Email already exists' })
    } else {
      // password hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await pool.query("insert into buser (email , password) values($1,$2) returning *", [email, hashedPassword]);

      return res.status(200).json({ message: 'User Registered Successfully' })
    }
  }
  catch (error) {
    return res.status(500).json(error);
  }
})

// get list of all users
User.get('/users', async (req, res) => {
  try {
    const user = await pool.query(
      "select * from buser order by user_id desc"
    );
    if (user.rows.length) {
      return res.status(200).json(user.rows);
    } else {
      return res.status(200).json({ message: 'Database Empty' })
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// get a user by id
User.get('/users/:id', async (req, res) => {
  try {
    let { id } = req.params;
    const user = await pool.query(
      "select * from buser where user_id=$1", [id]
    );
    if (user.rows.length) {
      return res.status(200).json(user.rows);
    } else {
      return res.status(404).json({ message: "User Does not exist" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// update password
User.patch('/users/:id', async (req, res) => {
  try {

    let { id } = req.params;
    let { password } = req.body;

    const user = await pool.query('select * from buser where user_id=$1', [id]);

    if (user.rows.length) {
      bcrypt
        .hash(password, saltRounds)
        .then(hashedPassword => {
          pool.query(
            "update buser set password=$1 where user_id=$2 returning *", [hashedPassword, id]
          ).then(res => res.rows).catch(err => err);
        })
      return res.status(200).json({ message: 'Password Updated' });
    } else {
      return res.status(404).json({ message: "User Does not exist" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// delete user
User.delete('/users/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;

    const exists = await pool.query('select user_id from buser where user_id=$1', [id]);

    console.log(exists);
    if (exists.rows.length) {
      const user = await pool.query(
        "delete from buser where user_id=$1 returning *", [id]
      );
      return res.status(202).json({
        message: `User Deleted`
      });
    } else {
      return res.status(404).json({ message: 'User does not exist' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

module.exports = User