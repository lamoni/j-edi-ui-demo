var express = require('express');
var router = express.Router();

// const WebSocket = require('ws');


var request = require('request');

const salt_bus = process.env.SALT_BUS || "http://localhost:8000";
const sse_endpoint = salt_bus + "/events?token=";

console.log(salt_bus);

router.get('/', function(req, res) {
    res.type('json');
    res.json({"name":"salt-events"});
});

router.post('/login', (req, res) => {
    let auth = req.body;
    let endpoint = salt_bus + "/login";

    request({"url":endpoint, "headers":{"Accept":"application/json"}, "method":"POST", json:auth}, (error, response, body) => {
        if(error) {
            return console.error(error);
        }
        else if(response && response.statusCode === 200) {
            res.json(body.return[0]);
        }
    });
});

module.exports = router;