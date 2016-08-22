/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/mongo/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'guest',
    email: 'guest@snm.ku.dk',
    password: 'guest',
		role: 'Guest' 
	}, {
    provider: 'local',
    name: '-- test --',
    email: 'david@ku.dk',
    password: 'david',
		role: 'Admin'
  }, {
    provider: 'local',
    name: 'andreas',
    email: 'akelager@snm.ku.dk',
    password: 'kelager',
		role: 'Admin' 
  }, {
    provider: 'local',
    name: 'Mette Grøn',
    email: 'mette.groen@snm.ku.dk',
    password: 'wuVb5tA3Sw',
		role: 'User' 
	}, {
    provider: 'local',
    name: 'Maja Elling',
    email: 'maja.elling@snm.ku.dk',
    password: 'sVq48mYhpk',
		role: 'User' 
	}, {
    provider: 'local',
    name: 'Marie Lillemark',
    email: 'marie.lillemark@snm.ku.dk',
    password: 'KPDt0p6AfG',
		role: 'User' 
	}, function() {
      console.log('finished populating users');
    }
  )
})


