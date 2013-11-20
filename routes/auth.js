
module.exports = function(app){

    app.get('/login', function(req, res){
        res.render('login', { user: req.user, message: req.flash('error') });
    });

    app.post('/login', app.authenticate(), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res){
        req.logout(); res.redirect('/');
    });

    app.get('/account', app.ensureAuthenticated, function(req, res){
        res.render('account', { user: req.user });
    });

}
