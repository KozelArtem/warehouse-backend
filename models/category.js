'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
    },
    {},
  );
  Category.associate = (models) => {
    Category.hasMany(Category, {
      foreignKey: 'parentId',
      sourceKey: 'id',
      as: 'childrens',
    });

    Category.hasMany(models.Item, {
      foreignKey: 'categoryId',
      sourceKey: 'id',
      as: 'items',
    });

    Category.hasOne(models.Category, {
      foreignKey: 'id',
      sourceKey: 'parentId',
      as: 'parent',
    });
  };
  return Category;
};
