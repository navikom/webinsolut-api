const test = require('tape');
const request = require('supertest');
const {HTTPStatus} = require('../../lib/helpers/HTTPStatus');

const app = require('../../lib/app').app;
const agent = request.agent(app);

exports.test = test;
exports.request = request;
exports.agent = agent;
const credentials = {
  email: 'cc2@cc.cc',
  password: '123456',
  grantType: 'password'
};
exports.credentials = credentials;
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
exports.userAgent = userAgent;

let data = {token: ''};
exports.data = data;

exports.runTest = function (table, result) {

  test(`==================== ${table.toUpperCase()} model tests ====================`, assert => {
    assert.end();
  });

  test(`/v1/${table}`, (assert) => {
    agent
      .get(`/v1/${table}`)
      .set('user-agent', userAgent)
      .expect(HTTPStatus.UNAUTHORIZED)
      .end((err, res) => {
        if (err) return assert.fail(JSON.stringify(res));
        assert.equal(res.text, 'Unauthorized', 'Response message Unauthorized');
        assert.end();
      });
  });

  test(`/v1/${table}/0/5`, (assert) => {
    agent
      .get(`/v1/${table}/0/5`)
      .set('Authorization', data.token)
      .set('user-agent', userAgent)
      .expect(HTTPStatus.OK)
      .end((err, res) => {
        if (err) return assert.fail(JSON.stringify(res));
        const {page, pageSize, count, items} = res.body.data;
        assert.equal(page, result.pagination.page, `Page is equal ${result.pagination.page}`);
        assert.equal(pageSize, result.pagination.pageSize, `Page size is equal ${result.pagination.pageSize}`);
        assert.equal(count, result.pagination.count, `Rows count is ${result.pagination.count}`);
        assert.end();
      });
  });

  function checkData(value, proof) {
    if(typeof value === 'object') {
      value = JSON.stringify(value);
      proof = JSON.stringify(proof);
    } else if(typeof  proof === 'number') {
      value = Number(value);
    } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      value = new Date(value).toDateString();
      proof = proof.toDateString();
    }
    return {value, proof};
  }

  test(`/v1/${table} insert`, (assert) => {
    if(result.insert) {
      agent
        .post(`/v1/${table}`)
        .set('Authorization', data.token)
        .set('user-agent', userAgent)
        .send(result.insert)
        .expect(HTTPStatus.OK)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res));
          Object.keys(result.insert).forEach(key => {
            const {value, proof} = checkData(res.body.data[key], result.insert[key]);
            assert.equal(value, proof, `Field '${key}' set to ${value}`);
          });
          assert.end();
        });
    } else {
      assert.end();
    }
  });

  test(`/v1/${table}${result.update ? '/' + result.update.id : ''} update`, (assert) => {
    if(result.update) {
      agent
        .put(`/v1/${table}/${result.update.id}`)
        .set('Authorization', data.token)
        .set('user-agent', userAgent)
        .send(result.update.body)
        .expect(HTTPStatus.OK)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res));
          Object.keys(result.update.body).forEach(key => {
            const {value, proof} = checkData(res.body.data[key], result.update.body[key]);

            assert.equal(value, proof, `Field '${key}' updated to ${res.body.data[key]}`);
          });
          assert.end();
        });
    } else {
      assert.end();
    }
  });

  test(`/v1/${table}${result.delete ? '/' + result.delete.id : ''} delete`, (assert) => {
    if(result.delete) {
      agent
        .delete(`/v1/${table}/${result.delete.id}`)
        .set('Authorization', data.token)
        .set('user-agent', userAgent)
        .expect(HTTPStatus.OK)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res));
          assert.equal(res.body.success, true, 'Row deleted');
          assert.end();
        });
    } else {
      assert.end();
    }

  });

};
