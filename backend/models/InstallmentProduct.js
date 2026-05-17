const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InstallmentProduct = sequelize.define('InstallmentProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    creditCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'credit_card_id'
    },
    productType: {
      type: DataTypes.ENUM('bill', 'cash'),
      allowNull: false,
      field: 'product_type'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false
    },
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'min_amount'
    },
    maxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'max_amount'
    }
  }, {
    tableName: 'installment_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return InstallmentProduct;
};
