const express = require('express')
const Admin = new express.Router()
const pool = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const auth = require('../helper/auth');

// Admin Login
Admin.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminLogin = await pool.query(
      "select * from buser where email=$1 and user_type=$2", [email, '1']
    );
    if (adminLogin.rows.length) {
      // compare the hashed password with the entered password
      const compare = await bcrypt.compare(password, adminLogin.rows[0].password);
      console.log(compare);
      if (compare) {
        const payload = {
          user: {
            user_id: adminLogin.rows[0].user_id,
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

        // return res.status(200).json(login.rows)


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

// Grant Admin priviledges to a User
Admin.patch('/admin/users/grant', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const user = await pool.query(
      "update buser set user_type=$1 where user_id=$2 returning *", [1, id]
    );
    res.status(201).json(user.rows);
  } catch (error) {
    res.status(400).send(error);
  }
})

// Revoke Admin priviledges to a User
Admin.patch('/admin/users/revoke', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const user = await pool.query(
      "update buser set user_type=$1 where user_id=$2 returning * ", [2, id]
    );
    res.status(201).json(user.rows);
  } catch (error) {
    res.status(400).send(error);
  }
})

// get all posts from db
Admin.get('/admin/posts', async (req, res) => {
  try {
    const posts = await pool.query(
      "select * from post order by post_id desc"
    );
    return res.status(200).json(posts.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Change post status to approved '2'
Admin.patch('/admin/posts/grant', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const posts = await pool.query(
      "update post set status=$1 where post_id=$2 returning *", ['2', id]
    );
    res.status(201).json(posts.rows);
  } catch (error) {
    res.status(400).json(error);
  }
})

// Change post status to 'in drafts not visible to public' '1'
Admin.patch('/admin/posts/revoke', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const posts = await pool.query(
      "update post set status=$1 where post_id=$2 returning *", ['1', id]
    );
    res.status(201).json(posts.rows);
  } catch (error) {
    res.status(400).json(error);
  }
})

// get all comments from db
Admin.get('/admin/comments', async (req, res) => {
  try {
    const comments = await pool.query(
      "select * from comment  order by comment_id desc"
    );
    return res.status(200).json(comments.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Change comment status to approved '2'
Admin.patch('/admin/comments/grant', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const comments = await pool.query(
      "update comment set status=$1 where comment_id=$2 returning *", ['2', id]
    );
    res.status(201).json(comments.rows);
  } catch (error) {
    res.status(400).json(error);
  }
})

// Change comment status to revoked '1'
Admin.patch('/admin/comments/revoke', auth, async (req, res) => {
  try {
    let { id } = req.body;
    const comments = await pool.query(
      "update comment set status=$1 where comment_id=$2 returning *", ['1', id]
    );
    res.status(201).json(comments.rows);
  } catch (error) {
    res.status(400).json(error);
  }
})

// Delete comment
Admin.delete('/admin/comments/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    const comments = await pool.query(
      "delete from comment where comment_id=$1 returning *", [id]
    );
    res.status(201).json({ message: 'Comment Deleted' });
  } catch (error) {
    res.status(400).json(error);
  }
})

module.exports = Admin