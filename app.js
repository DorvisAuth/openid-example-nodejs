import dotenv from 'dotenv';
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import OpenIDConnectStrategy from 'passport-openidconnect';

dotenv.config();

const app = express();

const ACR_VALUES = process.env.ACR_VALUES.split(',');

app.use(session({
  secret: 'some-random-string',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static(path.join(process.cwd(), 'templates')));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(process.cwd(), 'templates'));

const strategy = new OpenIDConnectStrategy({
  issuer: process.env.OIDC_ISSUER_URL,
  authorizationURL: `${process.env.OIDC_ISSUER_URL}/oauth2/auth`,
  tokenURL: `${process.env.OIDC_ISSUER_URL}/oauth2/token`,
  userInfoURL: `${process.env.OIDC_ISSUER_URL}/userinfo`,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  callbackURL: `${process.env.OIDC_REDIRECT_URL}`,
  scope: 'profile',
  passReqToCallback: true,
},
  function verify(req, issuer, profile, cb) {
    return cb(null, profile);
  }
);

strategy.authorizationParams = function (options) {
  const params = {};
  if (options.acr_values) {
    params.acr_values = options.acr_values;
  }
  return params;
};


passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get('/login', (req, res, next) => {

  passport.authenticate('openidconnect', req.query.acr_values ? { acr_values: req.query.acr_values } : {})(req, res, next);
});

app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get('/', function (req, res) {
  res.render('login', {
    providers: ACR_VALUES,
  });
});

app.get('/callback',
  passport.authenticate('openidconnect',
    { failureRedirect: '/login', failureMessage: true }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).render('error.html', {
        Error: 'Authentication failed.',
        LoginUrl: '/'
      });
    }

    console.log('User successfully authenticated:', req.user);

    res.render('callback.html', {
      user: req.user
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
