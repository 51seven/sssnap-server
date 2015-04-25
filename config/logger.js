var winston   = require('winston');

// Logger Configuration
var config = { levels: {}, colors: {}};

config.levels.debug = 0;
config.levels.verbose = 1;
config.levels.info = 2;
config.levels.warn = 3;
config.levels.error = 4;

config.colors.debug = "grey";
config.colors.verbose = "white";
config.colors.info = "cyan";
config.colors.warn = "yellow";
config.colors.error = "red";

// Configure color support for winston
winston.addColors(config.colors);

var logger = new winston.Logger;

// Set logger levels
logger.setLevels(config.levels);

// Transport logging to console
logger.add(winston.transports.Console, {
  colorize: true,
  level: 'debug',
  timestamp: function () {
    var d = new Date();

    var dd = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
    var mm = (d.getMonth() < 10) ? "0" + (d.getMonth()+1) : (d.getMonth()+1);
    var yyyy = d.getFullYear();

    var hh = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var mm = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var ss = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();

    return "[" + dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mm + ":" + ss + "]";
  }
});

// Abbreviate logging functions
logger.d = logger.debug;
logger.v = logger.verbose;
logger.i = logger.info;
logger.w = logger.warn;
logger.e = logger.error;

module.exports = logger;
