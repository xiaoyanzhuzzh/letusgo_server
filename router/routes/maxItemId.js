var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

router.get('/', function(req, res) {

  client.get('itemId', function(err, obj){
    res.send(obj);
  });
});

router.post('/', function (req, res) {

  client.get('items', function(err, data) {

    var newItems = JSON.parse(data);
    var ids = _.pluck(newItems, 'id');
    var newId = _.max(ids);
    
    client.set('itemId', newId, function(err, data) {

      res.send(data);
    });
  });
});


module.exports = router;

