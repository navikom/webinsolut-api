const common = require('../common');
const {runTest} = common;

runTest('pixart-categories',
  {
    pagination: {page: 0, pageSize: 5, count: 1},
    insert: {name: 'Some category'},
    update: {id: 2, body: {name: 'Another category name'}},
    delete: {id: 2}
  }
);
