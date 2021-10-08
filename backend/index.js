const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.port || 5000;

app.use(cors());
app.use(express.json());

// require all routers
const Login = require('./router/Login');
const Admin = require('./router/Admin');
const Post = require('./router/Post');
const User = require('./router/User');
const Comment = require('./router/Comment');
const getAuth = require('./router/getauth')
// middlewares
// Login
app.use(Login);
// admin
app.use(Admin);
// post
app.use(Post);
// user
app.use(User);
// Comment
app.use(Comment);
// auth
app.use(getAuth);

app.listen(PORT, async () => {
  try {
    console.log('server running on port ' + PORT);
  } catch (e) {
    console.log('Check server code');
  }
})