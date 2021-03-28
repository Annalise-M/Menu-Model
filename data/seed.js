const chance = require('chance').Chance();
const AdminService = require('../lib/services/admin-service');
const Menu = require('../lib/models/menu');
const Beer = require('../lib/models/beer');


// think about inputting exact emails into the seed source...
module.exports = async({ adminCount = 2, menuCount = 50, beerCount = 100 } = {}) => {
  const admins = await Promise.all([...Array(adminCount)].map((_, i) => {
    return AdminService.create({
      email: `test${i}@test.com`,
      password: `password${i}`
    });
  }));
  
  await Promise.all([...Array(menuCount)].map(() => {
    return Menu.insert({
      admin_Id: expect.any(String),
      item: 'food',
      detail: 'delicious',
      price: '8.50'
    });
    
  }));

  await Promise.all([...Array(beerCount)].map(() => {
    return Beer.insert({
      admin_Id: chance.pickone(admins).id,
      brewery: chance.sentence(),
      style: chance.sentence(),
      abv: chance.sentence(),
      price: chance.sentence()
    });
  }));
  
};

