module.exports = function(app, session, User, Post) {

  app.get('/dashboard', async (req, res) => {
    if (!req.session.admin)
    res.redirect('/');
  else {
      const posts = await Post.findAll({ order: [['id', 'DESC']]}); 
      res.render('dashboard', {
          authenticated: req.session.isAuthenticated,
          admin: req.session.admin,
          posts: posts,
          title: 'dashboard',
          action: 'dashboard',

      });
    }
  });

  app.get('/dashboard/users', async (req, res) => {
      if (!req.session.admin)
          res.redirect('/');
      else {
        const users = await User.findAll();
        res.render('users', {
            authenticated: req.session.isAuthenticated,
            admin: req.session.admin,
            users: users,
            title: 'users',
            action: 'users',
        
        });
      }
  });
}