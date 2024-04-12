const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // Require method-override package
const Post = require('./models/post');
const express_layout = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Apply method override middleware

const session = require('express-session');

app.use(express.static('public'));
app.use(express_layout);
app.set('layout', 'layouts/layout');
//app.use('/public/',  express.static('public'));

// Session middleware setup
app.use(session({
    secret: 'admin-secret-key', // Change this to a strong, random secret key
    resave: false,
    saveUninitialized: true
}));

// Index Route
// Route to render index page
app.get('/', async (req, res) => {
    const posts = await Post.findAll();
    const dates = posts.map(post => post.createdAt.toString().split(' ').slice(0, 4).join(' '));

    res.render('index', { 
        authenticated: req.session.isAuthenticated, 
        posts: posts,
        dates: dates,
        title: 'Home'
    });
});


// New Post Route
app.get('/posts/new', (req, res) => {
  res.render('new', {
    authenticated: req.session.isAuthenticated, 
    title: "Create post"
  })
});

// Create Post Route
app.post('/posts', async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
});

// Route to render post details
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findByPk(req.params.id);;
  
  // Pass the 'authenticated' variable to the EJS template
  res.render('show', { 
      authenticated: req.session.isAuthenticated, 
      post: post,
      title: post.title
  });
});

// Edit Post Route
app.get('/posts/:id/edit', async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) {
    res.render('edit', {
      authenticated: req.session.isAuthenticated,
      post,
      title: "Edit" +  post.title,
    });
  }
});

// Update Post Route
app.put('/posts/:id', async (req, res) => {
  await Post.update(req.body, { where: { id: req.params.id } });
  res.redirect(`/posts/${req.params.id}`);
});

// Delete Post Route
app.post('/posts/:id', async (req, res) => {
  console.log('Deleting post with id:', req.params.id);
  Post.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

// Route to render login page
app.get('/login', (req, res) => {
  res.render('login', 
      { 
          authenticated: req.session.isAuthenticated, 
          title: 'Login', 
      });
});


// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Check if username and password are valid
  if (username === 'admin' && password === 'password') {
    // Store user information in session
      req.session.isAuthenticated = true;
      req.session.username = username;

      // Redirect to admin dashboard if login is successful
      res.redirect('/');
    } else {
      // Redirect back to login page with error message if login fails
      res.redirect('/login?error=1');
    }
  });
  
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Redirect to the home page after logout
          res.redirect('/');
      }
  });
});

app.get('/blog', async (req, res) => {
  const posts = await Post.findAll();
  res.render('blog', { 
      authenticated: req.session.isAuthenticated, 
      posts: posts,
      title: 'Blog'
  });
});

app.get('/about', async (req, res) => {
  res.render('about', {
      authenticated: req.session.isAuthenticated,
      title: 'About'
  });
});

app.listen(3000, () => {
  console.log('\x1b[1mServer is running on http://localhost:3000\x1b[0m');
});
