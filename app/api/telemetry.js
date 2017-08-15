var express = require('express');
var router = express.Router();
var request = require('request');

var Providers = require('../providers/index');

router.get('/', function(req, res) {
    let influxClient = new Providers.InfluxDbProvider();
    influxClient.getEgressIngressTraffic().then((rows) => {
        console.log(rows);
        res.type('json');
        res.sendStatus(200);
    }, (error)  => {
        console.log(error); // Stacktrace
        res.type('json');
        res.sendStatus(500);
    });
});

router.post('/query', function(req, res) {
    let influxClient = new Providers.InfluxDbProvider();
    let query = req.body;
    influxClient.postQuery(query).then((rows) => {
        console.log(rows);
        res.type('json');
        res.status(200).json(rows);
    }, (error)  => {
        console.log(error); // Stacktrace
        res.type('json');
        res.sendStatus(500);
    });
});

router.get('/devices', function(req, res) {
    let influxClient = new Providers.InfluxDbProvider();
    influxClient.getHostRegExs().then((rows) => {
        console.log(rows);
        res.type('json');
        res.status(200).json(rows);
    }, (error)  => {
        console.log(error); // Stacktrace
        res.type('json');
        res.sendStatus(500);
    });
});

router.get('/interfaces', function(req, res) {
    let influxClient = new Providers.InfluxDbProvider();
    influxClient.getInterfaces().then((rows) => {
        console.log(rows);
        res.type('json');
        res.status(200).json(rows);
    }, (error)  => {
        console.log(error); // Stacktrace
        res.type('json');
        res.sendStatus(500);
    });
});

router.get('/metrics', function(req, res) {
    let influxClient = new Providers.InfluxDbProvider();
    influxClient.getMetrics().then((rows) => {
        console.log(rows);
        res.type('json');
        res.status(200).json(rows);
    }, (error)  => {
        console.log(error); // Stacktrace
        res.type('json');
        res.sendStatus(500);
    });
});


module.exports = router;