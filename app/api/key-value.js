var express = require('express');
var router = express.Router();

var redis = require('redis');

const redis_server = process.env.REDIS_SERVER || 'redis'
var client = redis.createClient(6379, redis_server);

client.on("connect", function (err) {
    console.log("connect");
});

client.on("ready", function (err) {
    console.log("ready");
});

router.get('/:key', function(req, res) {
    res.type('json');
    client.get(req.params.key, function(err, reply) {
        // reply is null when the key is missing 
        res.json(reply);
    });
});

router.delete('/:key', function(req, res) {
    res.type('json');
    client.del(req.params.key, function(err, reply) {
        res.status(202).json(reply);
    });
});

router.post('/', function(req, res) {
    let body = req.body;
    res.type('json');
    client.set(body.key, body.data, (err, reply) => {
        res.status(201).json(reply);
    });
});

module.exports = router;
