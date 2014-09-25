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

router.put('/', function(req, res) {

  var newCartItem = req.body.cartItem;

  client.get('cartItems', function(err, data) {

    var cartItems = JSON.parse(data);

    var index = _.findIndex(cartItems, {'item': newCartItem.item});
    cartItems[index].number = parseInt(newCartItem.number);

    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

      res.send(data);
    });
  });
});

router.delete('/', function(req, res) {

  client.del('cartItems');

  var cartItems = [];
  client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

    res.send(data);
  });
});

router.post('/:id', function(req, res) {

  var id = req.params.id;

  client.get('cartItems', function(err, data) {

    var cartItems = JSON.parse(data);
    var index = _.findIndex(cartItems, function(cartItem) {

      return cartItem.item.id.toString() === id;
    });

    cartItems[index].number += 1;
    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

      res.send(data);
    });
  });
});

router.put('/:id', function(req, res) {

  var id = req.params.id;

  client.get('cartItems', function(err, data) {

    var cartItems = JSON.parse(data);
    var index = _.findIndex(cartItems, function(cartItem) {

      return cartItem.item.id.toString() === id;
    });

    if(cartItems[index].number > 1) {

      cartItems[index].number -= 1;
    }
    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {

  var id = req.params.id;

  client.get('cartItems', function(err, data) {

    var cartItems = JSON.parse(data);
    var cartItem = _.find(cartItems, function(cartItem) {

      return cartItem.item.id.toString() === id;
    });

    _.remove(cartItems, cartItem);
    client.set('cartItems', JSON.stringify(cartItems), function(err, data) {

      res.send(data);
    });
  });
});

module.exports = router;
