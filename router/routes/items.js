var express = require('express');
var router = express.Router();

var redis = require('redis');
var client = redis.createClient();


var item0 = JSON.stringify({barcode:'ITEM000000', name: '可口可乐', unit: '瓶', price:3.00, category:'饮品'});
var item1 = JSON.stringify({barcode:'ITEM000001', name: '雪碧', unit:'瓶', price:3.00, category:'饮品'});
var item2 = JSON.stringify({barcode:'ITEM000002', name:'苹果', unit: '斤',price: 5.50, category:'水果'});
var item3 = JSON.stringify({barcode:'ITEM000003', name: '荔枝', unit:'斤', price:15.00,category:'水果'});
var item4 = JSON.stringify({barcode:'ITEM000004', name:'电池', unit: '个', price:2.00, category:'生活用品'});
var item5 = JSON.stringify({barcode:'ITEM000005', name:'方便面', unit:'袋',price: 4.50, category:'零食'});

client.lpush('items', item0);
client.lpush('items', item1);
client.lpush('items', item2);
client.lpush('items', item3);
client.lpush('items', item4);
client.lpush('items', item5);

router.get('/', function(req, res) {
  //TODO: Need to implement.
  client.lrange('items', -6 ,-1, function(err, items){
    res.send(items);
  });
  res.send('Success!');
});

router.post('/', function (req, res) {

  var items = req.param('items');

  client.set('items', items, function (err, obj) {
    res.send(obj);
  });

});

module.exports = router;
