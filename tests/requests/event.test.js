const common = require('./common');
const {HTTPStatus} = require('../../lib/helpers/HTTPStatus');
const {runTest, test, agent, data} = common;

runTest('events',
  {
    pagination: {page: 0, pageSize: 5, count: 1},
    insert: {title: 'Some title', info: {some_key: 'some value'}, userId: 2},
    update: {id: 2, body: {title: 'New title', info: {new_key: 'another value'}}},
    delete: {id: 2}
  }
);

test('/v1/events/0/10', (assert) => {
  agent
    .get('/v1/events/0/10')
    .set('Authorization', data.token)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const {items} = res.body.data;
      assert.end();
    });
});
