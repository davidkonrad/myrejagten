'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dinacollections-dev',
	database : 		'dinacollections-dev'
  },

  seedDB: true,
  
  mysql: {
	  database: 'specify',
	  username: 'root',
	  password: 'dadk'
  },
  tempuploaddir: '../uploads/'
  
};
