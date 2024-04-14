module.exports = function(app, session, User, Post, Comment) {
  
  // New Post Route
  app.get('/posts/new', (req, res) => {
    if (!req.session.admin)
      res.redirect('/');
    else
      res.render('new', {
        authenticated: req.session.isAuthenticated, 
        title: "Create post",
        action: 'create'
      })
  });
  
  // Route to render post details
  app.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findByPk(req.params.id);
    
    // Pass the 'authenticated' variable to the EJS template
    res.render('show', { 
      authenticated: req.session.isAuthenticated, 
      post: post,
      title: post.title,
      action: 'show'
    });
  });
  
  // Edit Post Route
  app.get('/posts/:id/edit', async (req, res) => {
    if (!req.session.admin)
      res.redirect('/');
    else {
      const post = await Post.findByPk(req.params.id);
      if (post) {
        res.render('edit', {
          authenticated: req.session.isAuthenticated,
          post,
          title: "Edit",
          action: 'edit'
        });
      }
    }
  });
  
  // Create Post Route
  app.post('/posts', async (req, res) => {
    await Post.create(req.body);
    const lastPost = await Post.findOne({ order: [['id', 'DESC']] });
    res.redirect(`/posts/${lastPost.id}`);
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
}