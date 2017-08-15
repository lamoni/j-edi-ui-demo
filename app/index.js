var cors = require('cors');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser');

let redis = require('redis');
let url = require('url');

const WebSocket = require('ws');
const EventSource = require('eventsource');

const salt_bus = process.env.SALT_BUS || "http://localhost:8000";
const sse_endpoint = salt_bus + "/events?token=";

let saltEvents = require('./api/salt-events');
let authenticationApi = require('./api/authentication');
let devicesApi = require('./api/devices');
let keyValueApi = require('./api/key-value');
let telemetryApi = require('./api/telemetry');

app.use(cors());
app.options('*', cors());
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const wss = new WebSocket.Server({ "server": server, "path":"/salt-events", clientTracking:true });

let source = undefined;

const redis_server = process.env.REDIS_SERVER || 'redis';
var sub = redis.createClient(6379, redis_server);
// console.log(redis_server);

server.listen(9090, "0.0.0.0");

app.get('/', function (req, res) {
    res.sendFile('./views/index.html', {root: __dirname + '/public/'});
});

app.use('/api/salt-events', saltEvents);
app.use('/api/authentication', authenticationApi);
app.use('/api/devices', devicesApi);
app.use('/api/key-value', keyValueApi);
app.use('/api/telemetry', telemetryApi);

app.get('*', function (req, res) {
    res.redirect('/');
});

wss.on('connection', (ws) => {
    let values = url.parse(ws.upgradeReq.url, true);

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    source = new EventSource(sse_endpoint + values.query.token);

    source.onopen = function() { console.log('opening the sse'); };
    source.onerror = function(e) { console.log('error! in sse', e); };
    source.onmessage = function(messageEvent) {
        if(messageEvent.data) {
            let eventResponse = JSON.parse(messageEvent.data);
            if(eventResponse.tag && eventResponse.tag.indexOf("salt_proxy") <= 0) {
                console.log(eventResponse);
                //console.log(wss.clients);
                if(ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify(eventResponse));
                }
                else {
                    console.log("disconnecting event source.");
                    source.close();
                }
            }
        }
    };

    ws.on('close', () => {
        console.log("web socket closed disconnecting event source.");
        source.close();     
    });
});