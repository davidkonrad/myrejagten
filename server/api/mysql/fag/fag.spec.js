'use strict';

var should = require('should');
var app = require('../../app');
var request = require('superfag');

describe('GET /api/mysql/fag', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/mysql/fag')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
