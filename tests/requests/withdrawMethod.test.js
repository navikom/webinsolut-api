const common = require('./common');
const {runTest} = common;

runTest('withdraw-methods',
  {
    pagination: {page: 0, pageSize: 5, count: 0},
    insert: {title: 'Some title'},
    update: {id: 1, body: {title: 'Another title'}},
    delete: {id: 1}
  }
);
