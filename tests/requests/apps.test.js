const common = require('./common');
const {HTTPStatus} = require('../../lib/helpers/HTTPStatus');
const {test, agent, runTest, data} = common;

runTest('apps',
  {
    pagination: {page: 0, pageSize: 5, count: 20},
    insert: {title: 'app22', categoryId: 1},
    update: {id: 21, body: {title: 'ap22Test'}},
    delete: {id: 21}
  });

test('/v1/apps/0/5', (assert) => {
  agent
    .get('/v1/apps/0/5')
    .set('Authorization', data.token)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const {items} = res.body.data;
      assert.equal(items[4].title, 'app5', '5th items title is "app5"');
      assert.end();
    });
});

test('/v1/apps/2/5', (assert) => {
  agent
    .get('/v1/apps/2/5')
    .set('Authorization', data.token)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const {page, items} = res.body.data;
      assert.equal(page, 2, 'Page is equal 2');
      assert.equal(items[4].title, 'app15', '5th item`s title is "app15"');
      assert.end();
    });
});
