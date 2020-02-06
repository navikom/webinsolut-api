const common = require('./common');
const {runTest} = common;

runTest('cards',
  {
    pagination: {page: 0, pageSize: 5, count: 0},
    insert: {userId: 2, cardholder: 'Test', cvv: 123, expires: new Date(), current: true, num: 4444333322221111},
    update: {id: 1, body: {cardholder: 'Test2', cvv: 222, current: false }},
    delete: {id: 1}
  }
);
