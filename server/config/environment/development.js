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
    uri: 'mongodb://localhost/dnaliv',
		database : 'dnaliv'
  },

  seedDB: true,
  
  mysql: {
	  database: 'dnaliv',
	  username: 'root',
	  password: 'zoo'
  }

  
};
