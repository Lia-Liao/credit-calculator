const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false
});

const CreditCard = require('../models/CreditCard')(sequelize);
const InstallmentProduct = require('../models/InstallmentProduct')(sequelize);

CreditCard.hasMany(InstallmentProduct, {
  foreignKey: 'creditCardId',
  as: 'products'
});
InstallmentProduct.belongsTo(CreditCard, {
  foreignKey: 'creditCardId',
  as: 'creditCard'
});

async function initDatabase() {
  await sequelize.sync({ force: false });
  console.log('数据库初始化完成');
  
  await seedSampleData();
}

async function seedSampleData() {
  const count = await CreditCard.count();
  if (count > 0) return;
  
  const sampleCards = [
    {
      bankName: '招商银行',
      billAmount: 15000,
      creditLimit: 50000,
      products: [
        { productType: 'bill', term: 3, rate: 0.045, minAmount: 1000, maxAmount: 50000 },
        { productType: 'bill', term: 6, rate: 0.042, minAmount: 1000, maxAmount: 50000 },
        { productType: 'bill', term: 12, rate: 0.048, minAmount: 1000, maxAmount: 50000 },
        { productType: 'cash', term: 3, rate: 0.052, minAmount: 1000, maxAmount: 50000 },
        { productType: 'cash', term: 6, rate: 0.049, minAmount: 1000, maxAmount: 50000 },
        { productType: 'cash', term: 12, rate: 0.055, minAmount: 1000, maxAmount: 50000 }
      ]
    },
    {
      bankName: '工商银行',
      billAmount: 25000,
      creditLimit: 80000,
      products: [
        { productType: 'bill', term: 3, rate: 0.043, minAmount: 1000, maxAmount: 80000 },
        { productType: 'bill', term: 6, rate: 0.040, minAmount: 1000, maxAmount: 80000 },
        { productType: 'cash', term: 3, rate: 0.050, minAmount: 1000, maxAmount: 80000 },
        { productType: 'cash', term: 6, rate: 0.047, minAmount: 1000, maxAmount: 80000 }
      ]
    }
  ];
  
  for (const cardData of sampleCards) {
    const { products, ...cardInfo } = cardData;
    const card = await CreditCard.create(cardInfo);
    
    for (const product of products) {
      await InstallmentProduct.create({
        creditCardId: card.id,
        ...product
      });
    }
  }
  
  console.log('示例数据已插入');
}

module.exports = {
  sequelize,
  CreditCard,
  InstallmentProduct,
  initDatabase
};
