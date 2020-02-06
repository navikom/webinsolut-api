function importTest(path) {
  require(path);
}

const common = require('./common');
const after = common.test;

describe('API Integration Test', function() {
  it('Api', done => {
    importTest('./users.test.js');
    importTest('./apps.test.js');
    importTest('./appCategory.test.js');
    importTest('./event.test.js');
    importTest('./card.test.js');
    importTest('./device.test.js');
    importTest('./image.test.js');
    importTest('./payment.test.js');
    importTest('./withdrawMethod.test.js');
    importTest('./pixart/category.test.js');
    importTest('./pixart/picture.test.js');
    after('after all tests', (assert) => {
      common.agent
        .get('/v1/exporter/export-data/test')
        .expect(200)
        .end((err, res) => {
          assert.end();
          done();
        });
    });
  });

});
