var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

var categories = [
    {id: 0, name: '饮品'},
    {id: 1, name: '水果'},
    {id: 2, name: '零食'},
    {id: 3, name: '生活用品'}
  ];

function getLastCategoryId(categories) {
  var ids = _.pluck(categories, 'id');
  var id = _.max(ids);

  return id;
}

function findCategoryById(categories, id) {
  return _.find(categories, function(category) {

    return category.id.toString() === id;
  });
}

function modifyCategory(categories, newCategory) {
  for(var i = 0; i < categories.length; i++) {
    if(newCategory.id === categories[i].id) {

      categories[i] = {
        id: id,
        name: newCategory.name
      };
    }
  }
  return categories;
}

client.set('categories',JSON.stringify(categories));

router.get('/', function(req, res) {
  
  client.get('categories', function(err, obj){
    res.send(obj);
  });
});

router.post('/', function(req, res) {
  client.get('categories', function(err, data) {
    var categories = JSON.parse(data);
    client.set('categories', JSON.stringify(categories), function (err, data) {

      res.send(data);
    });
  });
});

router.post('/:id', function(req, res) {
  var newCategory = req.body.category;

  client.get('categories', function(err, data) {
    var newCategories = JSON.parse(data);
    newCategory.id = getLastCategoryId(newCategories) + 1;

    newCategories.push(newCategory);
    client.set('categories', JSON.stringify(newCategories), function(err, data) {

      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  client.get('categories', function(err, data) {
    var categories = JSON.parse(data);

    var result = findCategoryById(categories, id);
    _.remove(categories, result);

    client.set('categories', JSON.stringify(categories), function(err, data) {
      res.send(data);
    })
  });
});

router.put('/:id', function(req, res) {
  var newCategory = req.body.category;

  client.get('categories', function(err, data) {
    var newCategories = JSON.parse(data);
    newCategories = modifyCategory(newCategories, newCategory);

    client.set('categories', JSON.stringify(newCategories), function(err, data) {

      res.send(data);
    });
  });
});

module.exports = router;
