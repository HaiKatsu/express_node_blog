const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // Require method-override package
const Post = require('./models/post');
const User = require ('./models/user');
const Comment = require ('./models/comment')
const express_layout = require('express-ejs-layouts');
const app = express();
const session = require('express-session');

// Session middleware setup
app.use(session({
    secret: 'admin-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Apply method override middleware

app.use(express.static('public'));
app.use(express_layout);
app.set('layout', 'layouts/layout');

require ('./routes/posts')(app, session, User, Post, Comment)
require ('./routes/connection')(app, session, User, Post)
require ('./routes/dashboard')(app, session, User, Post, Comment)

// Index Route
// Route to render index page
app.get('/', async (req, res) => {
    const posts = await Post.findAll({ order: [['id', 'DESC']], limit: 10 });    
    const dates = posts.map(post => post.createdAt.toString().split(' ').slice(0, 4).join(' '));

    res.render('index', { 
        authenticated: req.session.isAuthenticated,
        admin: req.session.admin, 
        posts: posts,
        dates: dates,
        title: 'Home',
        action: 'home'
    });
});

app.get('/blog', async (req, res) => {
  const posts = await Post.findAll();

  res.render('blog', { 
      authenticated: req.session.isAuthenticated, 
      admin: req.session.admin,
      posts: posts,
      title: 'Blog',
      action: 'blog'
  });
});

app.listen(3000, () => {
  console.log('\x1b[1mServer is running on http://localhost:3000\x1b[0m');
});
