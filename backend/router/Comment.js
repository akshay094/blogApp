const express = require('express')
const Comment = new express.Router()
const pool = require('../db');
const auth = require('../helper/auth')
// create new comment 
Comment.post('/comments', auth, async (req, res) => {
  try {
    let time = new Date().toTimeString().slice(0, 8);
    let date = new Date().toISOString().slice(0, 10);
    let timeStamp = date + ' ' + time;

    let { author, content, email, post_id } = req.body

    const comments = await pool.query("insert into comment(author, content, create_time, email, post_id) values($1,$2,$3,$4,$5) returning *", [author, content, timeStamp, email, post_id]);

    return res.status(201).json(comments.rows);
  } catch (error) {
    res.status(500).json(error);
  }
})

// get all approved comment
Comment.get('/comments', async (req, res) => {
  try {
    const comments = await pool.query("select * from comment where status='2' order by comment_id desc");
    if (comments.rows.length) {
      res.status(200).json(comments.rows);
    } else {
      res.status(200).json({ message: 'No comments found' });
    }
  } catch (e) {
    res.status(500).json(error);
  }
})

// get a comment by comment_id
Comment.get('/comments/:id', async (req, res) => {
  try {
    let { id } = req.params
    const comments = await pool.query('select * from comment where comment_id=$1', [id]);
    if (comments.rows.length) {
      res.status(200).json(comments.rows);
    } else {
      res.status(200).json({ message: 'No comments found' });
    }
  } catch (e) {
    res.status(500).json(e);
  }
})

// Update comment
Comment.patch('/comments/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    const { author, content } = req.body;
    const comments = await pool.query(
      'update comment set author=$1 , content=$2 where comment_id=$3 returning *',
      [author, content, id]
    );
    return res.status(200).json(comments.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Delete comment
Comment.delete('/comments/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;

    const exists = await pool.query(
      'select * from comment where comment_id=$1',
      [id]
    );
    console.log(exists.rows);
    if (exists.rows.length) {
      const deleteComment = await pool.query('delete from comment where comment_id=$1 returning *', [id]);
      return res.status(202).json({ message: 'Comment Deleted', data: deleteComment });
    } else {
      return res.status(404).json({ message: 'Comment does not exist' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// Get only 2 comments at a time
// pagination
Comment.post('/comments/v1/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const Page = req.query.page;
    const Limit = req.query.limit;
    if (!Page || !Limit || Page < 0 || Limit < 0) {
      return res.status(400).json({ message: 'Check Query Inputs' })
    }
    const comments = await pool.query("select * from comment  where status='2' and post_id=$1 order by comment_id desc limit $2", [id, Page * Limit])
    res.status(200).json(comments.rows);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = Comment;
