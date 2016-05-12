'use strict';

var should = require('should');
var app = require('../../app');
var request = require('superbooking');

describe('GET /api/mysql/booking', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/mysql/booking')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
