// const chance = require('chance').Chance();
const AdminService = require('../lib/services/admin-service');
const Menu = require('../lib/models/menu');
const Beer = require('../lib/models/beer');


module.exports = async({ adminCount = 2, menuCount = 30, beerCount = 70 } = {}) => {
  const admin = await Promise.all([...Array(adminCount)].map((_, i) => {
    return AdminService.create({
      email: `test${i}@test.com`,
      password: `password${i}`
    });
  }));
  
  await Promise.all([...Array(menuCount)].map(() => {
    return Menu.insert({
      adminId: 1,
      item: 'food',
      detail: 'delicious',
      price: '8.50'
    });
    
  }));

  await Promise.all([...Array(beerCount)].map(() => {
    return Beer.insert({
      adminId: 1,
      brewery: '2 Towns Bright IPA',
      style: 'IPA',
      abv: '6.2 %',
      price: '$8'
    });
  }));
  
  console.log(admin.id);
};
