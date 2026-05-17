const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CreditCard = sequelize.define('CreditCard', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'bank_name'
    },
    bankLogo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'bank_logo'
    },
    billAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'bill_amount'
    },
    creditLimit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'credit_limit'
    }
  }, {
    tableName: 'credit_cards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CreditCard;
};
