const common = require('./common');
const {runTest} = common;

runTest('payments',
  {
    pagination: {page: 0, pageSize: 5, count: 0},
    insert: {userId: 1, title: 'some payment', payment: 10.1},
    update: {id: 1, body: {payment: 20.1}},
    delete: {id: 1}
  }
);
