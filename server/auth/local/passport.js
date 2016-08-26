var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {

	  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {

			User.find({ 
				where : { email: email, password: password }
			}).then(function(user){
		  	//return res.json(200, booking);	
				return done(null, user);
		  }).catch(function(err) {
				return done(null, false, { message: 'Email eller password ikke korrekt.' });
		  });

			/*
      User.findOne({
        email: email.toLowerCase()
      }
			, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'Email er ikke registreret.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Password er ikke korrekt.' });
        }
        return done(null, user);
      });
			*/
    }
  ));
};
