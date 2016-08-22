'use strict';

// Development specific configuration
// ==================================
/*
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dinacollections-dev'
  },

  seedDB: true
};

*/

module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/myrejagten',
		database : 'myrejagten'
  },

  seedDB: true,
  
  mysql: {
	  database: 'myrejagten',
	  username: 'root',
	  password: 'dadk'
  }

  
};
