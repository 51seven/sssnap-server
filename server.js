// BASE SERVER SETUP
// =========================================================

var https = require('https');
var fs    = require('fs');
var path  = require('path');

// Establish our custom winston logger everywhere
global.Log = require('./config/logger');

var express           = require('express');
var bodyParser        = require('body-parser');
var multer            = require('multer');
var methodOverride    = require('method-override');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var flash             = require('express-flash');
var compression       = require('compression');
var morgan            = require('morgan');
var expressValidator  = require('express-validator');
var errorhandler      = require('errorhandler');
var mongoose          = require('mongoose');
var MongoStore        = require('connect-mongo')(session);
var cons              = require('consolidate');
var ejsHelper         = require('ejs-helper');
var helmet            = require('helmet');
var passport          = require('passport');

var env      = process.env.NODE_ENV || "development";
var secrets  = require('./config/secrets');


// CHECK ENVIRONMENT
// =========================================================

require('./check');


// DATABASE CONNECTION
// =========================================================

mongoose.connect(secrets[env].mongodb);

var connected = false;
mongoose.connection
  .on('connected', function () {
    connected = true;
    Log.i('MongoDB connection open to', secrets[env].mongodb);
  })
  .on('error', function (err) {
    Log.e('MongoDB connection error: ', err);
  })
  .on('disconnected', function () {
    if (connected) {
      Log.w('MongoDB connection disconnected');
      connected = false;
    }
  });

// TODO: Implement SIGTERM/SIGINT by first closing mongoose before
// terminating anything else.
function gracefullyExit() {
  mongoose.connection.close(function () {
    Log.i('MongoDB connection closed due to app termination');
    process.exit(0);
  });
}



// EXPRESS SETUP
// =========================================================

var app = express();

app.disable('x-powered-by');                      // No x-powered-by Header in response
app.engine('ejs', cons.ejs);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('port', process.env.PORT || 4000);
app.set('trust proxy', 1);                        // Trust first proxy (nginx)

if (env !== 'test')                               // An automatic logger is very distracting
  app.use(morgan('dev'));                         // while running tests.

app.use(compression());
app.use(helmet.xssFilter());                      // Prevents cross-site scripting attacks.
app.use(helmet.frameguard('SAMEORIGIN'));         // Prevents clickjacking by embedding the page
                                                  // in a <frame> or <iframe>.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './incoming/' }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());                          // "Normal" cookies won't be signed, but
app.use(session({                                 // the session cookie will be signed.
  name: 'sssnap.sid',
  secret: process.env.SESSION_SECRET || secrets.sessionSecret,
  saveUninitialized: false,                       // Completely new and not modified sessions will not be saved.
  resave: false,                                  // Don't save a session if it's not modified. ...
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 24 * 3600                         // ... However, save the session at least once every 24 hours.
  }),
  cookie: { secure: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(ejsHelper());
app.use(function (req, res, next) {
  res.locals.user = req.user;                     // Expose user in Template Engine
  next();
})

app.use(express.static(path.join(__dirname, 'public')));


// ROUTES
// =========================================================

var rootPages = require('./routes/rootpages');
var dashboard = require('./routes/dashboard');
var authorize = require('./routes/authorize');
var uploads   = require('./routes/uploads');
var users     = require('./routes/users');

app.use('/auth', authorize);
// app.use('/users', users);
// app.use('/uploads', uploads);
// app.use('/dashboard', dashboard);
app.use('/', rootPages);


// ERROR HANDLING
// =========================================================

if ('development' === env)
  app.use(errorhandler());


// WEBSERVER
// =========================================================

var options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.cert')
};

var server = https.createServer(options, app);
server.listen(app.get('port'), function () {
  Log.i('Server running on port', app.get('port'));
});
