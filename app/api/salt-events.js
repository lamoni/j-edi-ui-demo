var express = require('express');
var router = express.Router();
var request = require('request');

var Providers = require('../providers/index');

const EventSource = require('eventsource');
const salt_bus = process.env.SALT_BUS || "http://localhost:8000";
const sse_endpoint = salt_bus + "/events?token=";

let source = undefined;

router.get('/', function(req, res) {
    res.type('json');
    res.json({"name":"salt-events"});
});

router.post('/cli', (req, res) => {
    let saltEvent = req.body;
    let headers = {"Accept":"application/json", "X-Auth-Token":saltEvent.token};
    request({"url":salt_bus, "headers":headers, "method":"POST", json:saltEvent.cli}, (error, response, body) => {
        if(error) {
            return console.error(error);
            res.json(error);
        }
        else if(response && response.statusCode === 200) {
            res.status(201).json(body);
        }
    });
});

router.post('/getDevices', (req, res) => {
    let redisClient = new Providers.RedisProvider();
    let devices = undefined;
    redisClient.getMangedDevices().then((devices) => {
        if (devices) {
            redisClient.quit();
            res.type('json');
            res.status(200).json({return:[devices]});
        } else {
            let saltEvent = req.body;
            let headers = {"Accept":"application/json", "X-Auth-Token":saltEvent.token};
            request({"url":salt_bus, "headers":headers, "method":"POST", json:saltEvent.cli}, (error, response, body) => {
                if(error) {
                    return console.error(error);
                    res.json(error);
                }
                else if(response && response.statusCode === 200) {
                    redisClient.setManagedDevices(body.return[0], 300);

                    res.status(201).json(body);
                }
            });
        }
    });
});

router.post('/getInterfaces', (req, res) => {
    let redisClient = new Providers.RedisProvider();
    let interfaces = undefined;
    let saltEvent = req.body;
    let device = saltEvent.cli.tgt;
    redisClient.getManagedInterfaces(device).then((interfaces) => {
        if (interfaces) {
            redisClient.quit();
            res.type('json');
            res.status(200).json(interfaces);
        } else {
            let headers = {"Accept":"application/json", "X-Auth-Token":saltEvent.token};
            request({"url":salt_bus, "headers":headers, "method":"POST", json:saltEvent.cli}, (error, response, body) => {
                if(error) {
                    return console.error(error);
                    res.json(error);
                }
                else if(response && response.statusCode === 200) {
                    //redisClient.setManagedDevices(body.return[0], 300);
                    let rpcCommand = body.return[0][device];
                    let interfaceNames = [];
                    if(rpcCommand && rpcCommand['out']) {
                        for(var idx in rpcCommand['rpc_reply']['interface-information']['physical-interface']) {
                            var iface = rpcCommand['rpc_reply']['interface-information']['physical-interface'][idx]
                            interfaceNames.push(iface['name']);
                        }
                        redisClient.setManagedInterfaces(device, interfaceNames, 300);
                        res.status(200).json(interfaceNames);
                    }
                    else {
                        res.sendStatus(200);
                    }
                    console.log(body.return[0][device]);
                    
                }
            });
        }
    });
});

module.exports = router;