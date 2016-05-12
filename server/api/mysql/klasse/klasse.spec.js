'use strict';

var should = require('should');
var app = require('../../app');
var request = require('superklasse');

describe('GET /api/mysql/klasse', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/mysql/klasse')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
