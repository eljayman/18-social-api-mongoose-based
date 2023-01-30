const { User } = require('../models');

const hans = new User({
  username: 'Hans',
  email: 'hans@test.com',
});

console.log(hans);
