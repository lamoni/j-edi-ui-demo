var express = require('express');
var router = express.Router();
var request = require('request');

var Providers = require('../providers/index');

const salt_bus = process.env.SALT_BUS || "http://localhost:8000";

//Requires the X-Auth-Token for salt edi
router.get('/', function(req, res) {
    let redisClient = new Providers.RedisProvider();
    let devices = undefined;
    redisClient.getNetworkDevices().then((devices) => {
        if (devices) {
            redisClient.quit();
            res.type('json');
            res.status(200).json(devices);
        } else {
            let token = req.get('X-Auth-Token');
            let headers = {
                "Accept": "application/json",
                "X-Auth-Token": token
            };
            let url = salt_bus + '/minions';
            request({
                "url": url,
                "headers": headers,
                "method": "GET"
            }, (error, response, body) => {
                if (error) {
                    return console.error(error);
                    res.json(error);
                } else if (response && response.statusCode === 200) {
                    let rawData = JSON.parse(body);
                    let minions = rawData.return[0];
                    let minionIds = Object.keys(minions);
                    devices = [];
                    for (let i = 0; i < minionIds.length; i++) {
                        let minion = minions[minionIds[i]];
                        if (minion.kernelrelease && minion.kernelrelease === 'proxy') {
                            devices.push(minion.id);
                        }
                    }
                    redisClient.setNetworkDevices(devices, 300).then((replies) => {
                        redisClient.quit();
                    });
                    res.type('json');
                    res.status(200).json(devices);
                }
            });
        }
    });
});

module.exports = router;