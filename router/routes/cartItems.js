var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

function isExistInCart(id, cartItems){

  var item;
  for (var i = 0; i < cartItems.length; i++){

    if (id === cartItems[i].item.id){

      item = cartItems[i];
    }
  }
  return item;
}

function getCartItems(item, cartItems) {

  var cartItem = isExistInCart(item.id, cartItems);
  if (cartItem) {

    cartItem.number += 1;
  }
  else{

    cartItems.push({item: item, number: 1});
  }
}

router.get('/', function (req, res) {

  client.get('cartItems', function (err, obj) {
    res.send(obj);
  });
});

router.post('/', function(req, res) {

  var item = req.body.cartItem;

  client.get('cartItems', function(err, data) {

    var cartItems = JSON.parse(data) || [];
    getCartItems(item, cartItems);

    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

      res.send(data);
    });
  });
});



module.exports = router;
