const bcrypt = require('bcryptjs');

bcrypt
  .hash('password', 8)
  .then(hash => console.log(hash));

// const jwt = require('jsonwebtoken');



// const token = jwt.sign({
//   email: 'email@email.com',
//   password: 'password'
// }, 'supersecret');

// console.log(token, 'heosoinflsinclsien');
