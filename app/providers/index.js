let RedisProvider = require('./redis-provider');
let InfluxDbProvider = require('./influxdb');

let Providers = {
    RedisProvider: RedisProvider,
    InfluxDbProvider: InfluxDbProvider
};
module.exports = Providers;