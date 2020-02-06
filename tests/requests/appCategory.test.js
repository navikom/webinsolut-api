const common = require('./common');
const {runTest} = common;

runTest('app-categories',
  {
    pagination: {page: 0, pageSize: 5, count: 1},
    insert: {name: 'category_test'},
    update: {id: 2, body: {name: 'category_test_2'}},
    delete: {id: 2}
    }
);
