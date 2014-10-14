var express = require('express');
var router = express.Router();

var _ = require('lodash');

var redis = require('redis');
var client = redis.createClient();

var initItems = [
  {id: 0, barcode:'ITEM000000', name: '可口可乐', unit: '瓶', price:3.00, category:'饮品'},
  {id: 1, barcode:'ITEM000001', name: '雪碧', unit:'瓶', price:3.00, category:'饮品'},
  {id: 2, barcode:'ITEM000002', name:'苹果', unit: '斤',price: 5.50, category:'水果'},
  {id: 3, barcode:'ITEM000003', name: '荔枝', unit:'斤', price:15.00,category:'水果'},
  {id: 4, barcode:'ITEM000004', name:'电池', unit: '个', price:2.00, category:'生活用品'},
  {id: 5,barcode:'ITEM000005', name:'方便面', unit:'袋',price: 4.50, category:'零食'}
];

function getLastItemId(items) {
  var ids = _.pluck(items, 'id');
  var id = _.max(ids);

  return id;
}

function findItemId(items, id) {

  return _.find(items, function(item) {

    return item.id.toString() === id;
  });
}

function modifyItem(items, newItem){
  for(var i = 0; i < items.length; i++) {

    if(newItem.id === items[i].id) {

      items[i] = {
        id: newItem.id,
        barcode: newItem.barcode,
        name: newItem.name,
        unit: newItem.unit,
        price: newItem.price,
        category: newItem.category
      };
    }
  }
  return items;
}

client.set('items', JSON.stringify(initItems));

router.get('/', function(req, res) {

  client.get('items', function(err, obj){
    res.send(obj);
  });
});

router.post('/', function (req, res) {

  client.get('items', function(err, data) {

    var newItems = JSON.parse(data) || initItems;
    
    client.set('items', JSON.stringify(newItems), function(err, data) {
       res.send(data);
    });
  });
});

router.get('/:id', function(req, res) {

  var id = req.params.id;
  client.get('items', function(err, data) {

    var newItems = JSON.parse(data);

    var result = findItemId(newItems, id);
    if(result){
      res.send(result);
    } else{
      res.sendStatus(404);
    }
  });
});

router.post('/:id', function(req, res) {

  var newItem = req.body.item;

  client.get('items', function(err, data) {
    var newItems = JSON.parse(data);

    newItem.id = getLastItemId(newItems) + 1;
    newItems.push(newItem);

    client.set('items', JSON.stringify(newItems), function(err, data) {
      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {

  var id = req.params.id;
  client.get('items', function(err, items) {
    var newItems = JSON.parse(items);

    var result = findItemId(newItems, id);
    _.remove(newItems, result);

    client.set('items', JSON.stringify(newItems), function(err, data) {
      res.send(data);
    });
  });
});

router.put('/:id', function(req, res) {

  var newItem = req.body.item;

  client.get('items', function(err, items) {

    var newItems = JSON.parse(items);
    newItems = modifyItem(newItems, newItem);

    client.set('items', JSON.stringify(newItems), function(err, obj) {
      res.send(obj);
    });
  });
});



module.exports = router;


