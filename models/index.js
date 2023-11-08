// imports the models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
//Connects a Category with a Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
});
//Connects Products to Categories
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});
//Connects Products with Tags
Product.belongsToMany(Tag, {
  through: ProductTag
});
//Connects Tags with Products
Tag.belongsToMany(Product, {
  through: ProductTag
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};