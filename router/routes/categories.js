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

client.set('categories',JSON.stringify(categories));

router.get('/', function(req, res) {
  //TODO: Need to implement.
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

  var id = req.params.id;
  var newCategory = req.body.category;

  client.get('categories', function(err, data) {

    var newCategories = JSON.parse(data);
    var ids = _.pluck(newCategories, 'id');
    if(!_.contains(ids, id)){

      newCategories.push(newCategory);
    }
    console.log(newCategories);
    client.set('categories', JSON.stringify(newCategories), function(err, data) {
      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {

  var id = req.params.id;
  client.get('categories', function(err, data) {

    var categories = JSON.parse(data);
    var result = _.find(categories, function(category) {

      return category.id.toString() === id;
    });
    _.remove(categories, result);

    client.set('categories', JSON.stringify(categories), function(err, data) {

      res.send(data);
    })
  });
});

router.put('/:id', function(req, res) {

  var id = req.params.id;
  var newCategory = req.body.category;
  client.get('categories', function(err, data) {

    var newCategories = JSON.parse(data);

    for(var i = 0; i < newCategories.length; i++) {
      if(newCategory.id === newCategories[i].id) {

        newCategories[i] = {
          id: id,
          name: newCategory.name
        };
      }
    }
    console.log(newCategories);
    client.set('categories', JSON.stringify(newCategories), function(err, data) {
      console.log(data);
      res.send(data);
    });
  });
});

module.exports = router;
