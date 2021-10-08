const express = require('express');
const Post = new express.Router();
const pool = require('../db');
const auth = require('../helper/auth');

// create new post
Post.post('/posts', auth, async (req, res) => {
  try {
    let time = new Date().toTimeString().slice(0, 8);
    let date = new Date().toISOString().slice(0, 10);
    let timeStamp = date + ' ' + time;
    const { title, content, tags, user_id } = req.body;
    const posts = await pool.query(
      "insert into post(title, content, tags , user_id, create_time , update_time) values($1,$2,$3,$4,$5,$6) returning *", [title, content, tags, user_id, timeStamp, timeStamp]
    );
    return res.status(201).json(posts.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// get all posts approved by admin
Post.get('/posts', async (req, res) => {
  try {
    const posts = await pool.query(
      "select * from post where status='2' order by post_id desc"
    );
    return res.status(200).json(posts.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// get post by id
Post.get('/posts/:id', async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    const posts = await pool.query(
      "select * from post where post_id=$1", [id]
    );
    return res.status(200).json(posts.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Update post
Post.patch('/posts/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let time = new Date().toTimeString().slice(0, 8);
    let date = new Date().toISOString().slice(0, 10);
    let timeStamp = date + ' ' + time;
    const { title, content, tags } = req.body;
    const posts = await pool.query(
      'update post set title=$1 , content=$2 , tags=$3 ,update_time=$4 where post_id=$5 returning *',
      [title, content, tags, timeStamp, id]
    );
    return res.status(204).json(posts.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Delete post
Post.delete('/posts/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;

    const exists = await pool.query(
      'select * from post where post_id=$1',
      [id]
    );
    console.log(exists.rows);
    if (exists.rows.length) {
      const deletePost = await pool.query('delete from post where post_id=$1 returning *', [id]);
      return res.status(202).json({ message: "Post Deleted", data: deletePost });
    } else {
      return res.status(404).json({ message: 'Post does not exist' });
    }

  } catch (error) {
    return res.status(500).json(error);
  }
})

// pagination
Post.post('/posts/v1', async (req, res) => {
  try {
    const Page = req.query.page;
    const Limit = req.query.limit;
    if (!Page || !Limit || Page < 0 || Limit < 0) {
      return res.status(400).json({ message: 'Check Query Inputs' })
    }
    const post = await pool.query("select * from post  where status='2' order by post_id desc  limit $1", [Page * Limit])
    res.status(200).json(post.rows);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = Post;