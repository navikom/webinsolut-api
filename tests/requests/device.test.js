const common = require('./common');
const {runTest} = common;

runTest('devices',
  {
    pagination: {page: 0, pageSize: 5, count: 3},
    insert: {info: {some_key: 'some value'}},
    update: {id: 4, body: {info: {new_key: 'new value'}}},
    delete: {id: 4}
  }
);
