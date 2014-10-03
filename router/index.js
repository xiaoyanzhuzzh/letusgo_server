module.exports = function(app) {
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/items', require('./routes/items'));
  app.use('/api/cartItems', require('./routes/cartItems'));
  app.use('/api/maxItemId', require('./routes/maxItemId'));
  app.use('/api/maxCategoryId', require('./routes/maxCategoryId'));
  app.use('/api/payment', require('./routes/payment'));
};
