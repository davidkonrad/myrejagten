'use strict';

describe('Service: MysqlUser', function () {

  // load the service's module
  beforeEach(module('myrejagtenApp'));

  // instantiate service
  var MysqlUser;
  beforeEach(inject(function (_MysqlUser_) {
    MysqlUser = _MysqlUser_;
  }));

  it('should do something', function () {
    expect(!!MysqlUser).toBe(true);
  });

});
