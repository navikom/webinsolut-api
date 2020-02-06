const common = require('../common');
const {runTest} = common;

runTest('pixart-pictures',
  {
    pagination: {page: 0, pageSize: 5, count: 0}
  }
);
