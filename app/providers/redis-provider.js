var redis = require('redis');

const redis_server = process.env.REDIS_SERVER || 'redis';
const DEVICES_KEY = 'devices';
const MANAGED_DEVICES = 'managed-devices';
const MANAGED_INTERFACES = 'managed-interace-';

function RedisProvider(options) {
    this.client = redis.createClient(6379, redis_server);
}

function getMangedDevices() {
    return new Promise((resolve, reject) => {
        this.client.lrange(MANAGED_DEVICES, 0, -1, (err, reply) => {
            if(err) console.log(err);
            if(reply && reply.length == 0) reply = undefined;
            resolve(reply);
        });
    });    
}

function setManagedDevices(devices, expire) {
    let multi = this.client.multi();
    expire = expire ? expire : 300;

    return new Promise((resolve, reject) => {
        multi.rpush(MANAGED_DEVICES, devices);
        multi.expire(MANAGED_DEVICES, expire);
        multi.exec((err, replies) => {
            if(err) console.log(err);
            resolve(replies);
        });
    });
}

function getManagedInterfaces(device) {
    return new Promise((resolve, reject) => {
        this.client.lrange(MANAGED_INTERFACES + device, 0, -1, (err, reply) => {
            if(err) console.log(err);
            if(reply && reply.length == 0) reply = undefined;
            resolve(reply);
        });
    });    
}

function setManagedInterfaces(device, interfaces, expire) {
    let multi = this.client.multi();
    expire = expire ? expire : 300;

    return new Promise((resolve, reject) => {
        multi.rpush(MANAGED_INTERFACES + device, interfaces);
        multi.expire(MANAGED_INTERFACES + device, expire);
        multi.exec((err, replies) => {
            if(err) console.log(err);
            resolve(replies);
        });
    });
}

//Returns a promise
function getNetworkDevices() {
    return new Promise((resolve, reject) => {
        this.client.lrange(DEVICES_KEY, 0, -1, (err, reply) => {
            if(err) console.log(err);
            if(reply && reply.length == 0) reply = undefined;
            resolve(reply);
        });
    });
}

function setNetworkDevices(devices, expire) {
    let multi = this.client.multi();
    expire = expire ? expire : 300;

    return new Promise((resolve, reject) => {
        multi.rpush(DEVICES_KEY, devices);
        multi.expire(DEVICES_KEY, expire);
        multi.exec((err, replies) => {
            if(err) console.log(err);
            resolve(replies);
        });
    });
}

function quit() {
    this.client.quit();
}

RedisProvider.prototype = {
    getNetworkDevices:getNetworkDevices,
    setNetworkDevices:setNetworkDevices,
    quit:quit,
    getMangedDevices:getMangedDevices,
    setManagedDevices:setManagedDevices,
    getManagedInterfaces:getManagedInterfaces,
    setManagedInterfaces:setManagedInterfaces
}

module.exports  = RedisProvider;