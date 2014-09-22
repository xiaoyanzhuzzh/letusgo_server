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
client.set('items', JSON.stringify(initItems));

router.get('/', function(req, res) {
  //TODO: Need to implement.
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

router.get('/:id', function(req, res){

  var id = req.params.id;
  client.get('items', function(err, data) {

    var newItems = JSON.parse(data);
    console.log(newItems);
    var result = _.find(newItems, function(item){
      return item.id.toString() === id;
    });

    if(result){
      res.send(result);
    } else{
      res.sendStatus(404);
    }
  });
});

router.post('/:id', function(req, res) {

  var id = req.params.id;
  var newItem = req.body.item;

  client.get('items', function(err, data) {
    var newItems = JSON.parse(data);
    var ids = _.pluck(newItems, 'id');
    if(!_.contains(ids, id)){

      newItems.push(newItem);
    }
    console.log(newItems);
    client.set('items', JSON.stringify(newItems), function(err, data) {
      res.send(data);
    });
  });
});

router.delete('/:id', function(req, res) {

  var id = req.params.id;
  client.get('items', function(err, items) {

    var newItems = JSON.parse(items);
    var result = _.find(newItems, function(item) {
      return item.id.toString() === id;
    });
    _.remove(newItems, result);

    client.set('items', JSON.stringify(newItems), function(err, data) {
      res.send(data);
    });
  });
});

router.put('/:id', function(req, res) {

  var id = req.params.id;
  var newItem = req.body.item;

  client.get('items', function(err, items) {

    var newItems = JSON.parse(items);

    for(var i = 0; i < newItems.length; i++) {
      if(newItem.id === newItems[i].id) {

        newItems[i] = {
          id: newItem.id,
          barcode: newItem.barcode,
          name: newItem.name,
          unit: newItem.unit,
          price: newItem.price,
          category: newItem.category
        };
      }
    }
    console.log(newItems);
    client.set('items', JSON.stringify(newItems), function(err, obj) {
      console.log(obj);
      res.send(obj);
    });
  });
});

module.exports = router;


