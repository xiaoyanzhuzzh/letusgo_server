var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

function deleteCartItem(cartItems, id) {
  var cartItem = _.find(cartItems, function(cartItem) {
    return cartItem.item.id.toString() === id;
  });

  _.remove(cartItems, cartItem);
}

router.get('/', function (req, res) {

  client.get('cartItems', function (err, obj) {
    res.send(obj);
  });
});

router.post('/', function(req, res) {
  var newCartItems = req.body.cartItems;

  client.set('cartItems', JSON.stringify(newCartItems), function(err, data) {
    res.send(data);
  });
});


router.put('/:id', function(req, res) {
  var id = req.params.id;
  var newCartItem = req.body.cartItem;
  console.log(newCartItem.number);

  client.get('cartItems', function(err, data) {
    var cartItems = JSON.parse(data);
    var cartItem = _.find(cartItems, function(cartItem) {
      return cartItem.item.id.toString() === id;
    });

    cartItem.number = newCartItem.number;
    console.log(cartItem.number);
    console.log(cartItems);


    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {
      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  client.get('cartItems', function(err, data) {
    var cartItems = JSON.parse(data);
    deleteCartItem(cartItems, id);

    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {
      res.send(data);
    });
  });
});

module.exports = router;
