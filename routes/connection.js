const posts = require("./posts");

module.exports = function(app, session, User, Post) { 
    // Route to render login page
    app.get('/login', (req, res) => {
        
        if (req.session.isAuthenticated)
            res.redirect('/');
        else
            res.render('login', 
            { 
                authenticated: req.session.isAuthenticated, 
                title: 'Login',
                action: 'login'
            });
    });

    app.get('/register', (req, res) => {
        if (req.session.isAuthenticated)
            res.redirect('/');
        else
            res.render('register', 
            { 
                authenticated: req.session.isAuthenticated, 
                title: 'register',
                action: 'register'
            });
    });
    
    
    // Route to handle login form submission
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({where: {email: username}});
        
        
        if (user != null && user.password === password) {
            console.log("HELLO");
            // Store user information in session
            req.session.isAuthenticated = true;
            req.session.username = username;
            req.session.admin = false;
            // Redirect to admin dashboard if login is successful
            res.redirect('/');
        }

        // Check if is admin
        else if (username === 'admin' && password === 'password') {
            // Store user information in session
            req.session.isAuthenticated = true;
            req.session.username = username;
            req.session.admin = true;
            
            // Redirect to admin dashboard if login is successful
            res.redirect('/');
        }        
        else {
            // Redirect back to login page with error message if login fails
            res.redirect('/login?error=1');
        }
    });

    // Route to handle login form submission
    app.post('/register', async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({where: {email: email}})

        if (user == null && email != 'admin') {
            User.create({ email: email, password: password });
            res.redirect('/login');
        }
        else {
            res.redirect('/register');
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
}