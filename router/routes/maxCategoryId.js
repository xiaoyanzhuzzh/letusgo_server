var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

client.set('categoryId', 3);

router.get('/', function(req, res) {

  client.get('categoryId', function(err, obj) {
    res.send(obj);
  });
});

router.post('/', function(req, res) {
  client.get('categories', function(err, data) {

    var newCategories = JSON.parse(data);
    var ids = _.pluck(newCategories, 'id');
    var newId = _.max(ids);

    client.set('categoryId', newId, function(err, obj) {
      res.send(obj);
    });
  });
});

module.exports = router;

