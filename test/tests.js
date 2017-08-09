var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    Promise = require('bluebird'),
    request = require('superagent-promise')(require('superagent'), Promise),
    chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var url = process.env.PHRASEBOOK_API_ENDPOINT || 'http://localhost:8080';

describe('User registration: success', function() {
    var result;

    before(function() {
        result = post(url + "/registration", {
            name: 'Petya',
            email: '1petya@gmail.com',
            password: 'some-valid-password'
        });
    });

    it('should return a 200 response', function() {
        return assert(result, "status").to.equal(200);
    });

    it('should receive back user name', function() {
        return assert(result, 'body.name').to.equal('Petya');
    });

    it('should receive back user email', function() {
        return assert(result, 'body.email').to.equal('1petya@gmail.com');
    });
});

describe('User registration: wrong email', function() {
    var result;

    before(function() {
        result = post(url + "/registration", {
            name: 'Petya',
            email: 'wrong-email',
            password: 'some-valid-password'
        });
    });

    it('should return a 200 response', function() {
        return assert(result, "status").to.equal(200);
    });

    it('should receive back validation error', function() {
        return assert(result, 'body.error.type').to.equal('validation_error');
    });

    it('should receive back error field explanation', function() {
        return assert(result, 'body.error.data.field').to.equal('email');
    });

    it('should receive back error explanation', function() {
        return assert(result, 'body.error.data.error').to.equal('invalid email');
    });
});

describe('User registration: existing email', function() {
    var result;

    before(function() {
        result = post(url + "/registration", {
            name: 'Petya',
            email: '1petya@gmail.com',
            password: 'some-valid-password'
        });
    });

    it('should return a 200 response', function() {
        return assert(result, "status").to.equal(200);
    });

    it('should receive back validation error', function() {
        return assert(result, 'body.error.type').to.equal('validation_error');
    });

    it('should receive back error field explanation', function() {
        return assert(result, 'body.error.data.field').to.equal('email');
    });

    it('should receive back error explanation', function() {
        return assert(result, 'body.error.data.error').to.equal('such email already exists');
    });
});

/*
 * Convenience functions
 */
// POST request with data and return promise
function post(url, data) {
  return request.post(url)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    // .set('Accept', 'application/json')
    .send(data)
    .end();
}

// GET request and return promise
function get(url) {
  return request.get(url)
    .set('Accept', 'application/json')
    .end();
}

// DELETE request and return promise
function del(url) {
  return request.del(url).end();
}

// UPDATE request with data and return promise
function update(url, method, data) {
  return request(method, url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
    .end();
}

// Resolve promise for property and return expectation
function assert(result, prop) {
  return expect(result).to.eventually.have.deep.property(prop)
}