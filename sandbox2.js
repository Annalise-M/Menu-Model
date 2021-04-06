const jwt = require('jsonwebtoken');

const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJpYXQiOjE2MTc2NzQ1NTMsImV4cCI6MTYxNzY3NDU1NH0.TffbfxahPkDwfn9TQdqqR7pQmq6yklt5lNX7vFTrUBw';
const timedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJpYXQiOjE2MTc2NzQ0ODgsImV4cCI6MTYxNzcxNzY4OH0.S97uW2JNPOSnTsL5_nSDwzFcAchJyB-4rZR5OGX2A8o';

//sign
// const token = jwt.sign({
//   email: 'email@email.com',
//   password: 'password'
// }, 'supersecret', {
//   expiresIn: '12h'
// });

// header + payload + supersecret
// console.log(token);


//verify
const result = jwt.verify(timedToken, 'supersecret');
console.log(result);
// const token = jwt.sign({
//   email: 'email@email.com',
//   password: 'password'
// }, 'supersecret');

// console.log(token, 'heosoinflsinclsien');
