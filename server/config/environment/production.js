'use strict';

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            80,

  mysql: {
	  host: process.env.OPENSHIFT_MYSQL_DB_HOST,
	  port: process.env.OPENSHIFT_MYSQL_DB_PORT,
	  username: 'root', 
	  password: 'Kelager%666', 
	  database: 'myrejagten'
  },

	uploadDir : './public/uploads'



};
