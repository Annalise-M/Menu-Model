const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('password', 14);
console.log(hash, 'heloooosoooooooooooooo');

// APPARENTLY OUTDATED METHOD WITH THE LATEST VERSION of the bcrypt/hashing method(s)- chaining method doesnt appear to register with bcrypt docs \\

// bcrypt
//   .compare('password', hash)
//   .then(result => console.log(result));

// const jwt = require('jsonwebtoken');

// const token = jwt.sign({
//   email: 'email@email.com',
//   password: 'password'
// }, 'supersecret');

// console.log(token, 'heosoinflsinclsien');
