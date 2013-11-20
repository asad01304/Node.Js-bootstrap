var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

var User = {

    findById : function (id, fn) {

        var result = users.filter(function(user){
            return user.id == id;
        });

        return (result.length) ? fn(null, result[0]) :
            fn(new Error('User ' + id + ' does not exist'));

    },

    findByUsername : function (username, fn) {

        var result = users.filter(function(user){
            return user.username === username;
        });

        return (result.length) ?  fn(null, result[0]) : fn(null, null);
    }

}

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(

    function(username, password, done) {

        process.nextTick(function () {

            User.findByUsername(username, function(err, user) {

                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Unknown user ' + username });
                }

                if (user.password != password) {
                    return done(null, false, { message: 'Invalid password' });
                }

                return done(null, user);

            })
        });
    }
));


module.exports = function(app, express){

    app.use(express.cookieParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.ensureAuthenticated = function(req, res, next) {

        if (req.isAuthenticated()) { return next(); }

        res.redirect('/login')
    }

    app.authenticate = function() {
        return passport.authenticate('local', { failureRedirect: '/login', failureFlash: true });
    }
}