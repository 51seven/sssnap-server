/**
 * CAUTION  CAUTION  CAUTION
 *
 * Be careful to never ever commit or even push real secret
 * configurations like keys or passwords here.
 */

module.exports = {

  development: {

    mongodb: process.env.MONGODB || "mongodb://localhost:27017/sssnap",

  },

  sessionSecret: "Better use process.env.SESSION_SECRET in a production environment"

}
