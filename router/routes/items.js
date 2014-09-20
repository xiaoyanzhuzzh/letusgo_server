var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();


function getItemsAndIds(data){
  data.id = id;
  return data;
}

var loadItems = function(){

  return [
        {id: 0, barcode:'ITEM000000', name: '可口可乐', unit: '瓶', price:3.00, category:'饮品'},
        {id: 1, barcode:'ITEM000001', name: '雪碧', unit:'瓶', price:3.00, category:'饮品'},
        {id: 2, barcode:'ITEM000002', name:'苹果', unit: '斤',price: 5.50, category:'水果'},
        {id: 3, barcode:'ITEM000003', name: '荔枝', unit:'斤', price:15.00,category:'水果'},
        {id: 4, barcode:'ITEM000004', name:'电池', unit: '个', price:2.00, category:'生活用品'},
        {id: 5,barcode:'ITEM000005', name:'方便面', unit:'袋',price: 4.50, category:'零食'},
     ];
};

var items = loadItems();
client.set('items', JSON.stringify(items));

router.get('/', function(req, res) {
  //TODO: Need to implement.
  client.get('items', function(err, items){
    res.send(items);
  });
});

router.post('/', function (req, res) {

  var items = req.param('items');

  client.set('items', items, function (err, obj) {
    res.send(obj);
  });
});

router.get('/:id', function(req, res){

  var id = req.params.id;
  var result = _.find(items, function(item){
    return item.id.toString() === id;
  });

  if(result){
    res.send(result);
  } else{
    res.sendStatus(404);
  }
});


module.exports = router;
