var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

router.post('/', function(req, res) {

  client.del('cartItems');

  var cartItems = [];
  client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

    res.send(data);
  });
});
module.exports = router;
