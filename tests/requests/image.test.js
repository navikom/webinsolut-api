const common = require('./common');
const {runTest} = common;

runTest('images',
  {
    pagination: {page: 0, pageSize: 5, count: 0},
    insert: {path: 'some/path', title: 'test image'},
    update: {id: 1, body: {path: 'some/new/path', title: 'another image'}},
    delete: {id: 1}
  }
);
