let Influx = require('influx');

function InfluxDbProvider() {
    console.log('about to connect to influxdb');
    this.influxDb = new Influx.InfluxDB({
        host: process.env.INFLUX_URL || "localhost:8000",
        database: process.env.INFLUX_DB || 'juniper',
        username: process.env.INFLUX_USER || 'juniper',
        password: process.env.INFLUX_PW || 'juniper'
    });
    this.exectuteQuery = exectuteQuery;
}

function quit() {
    console.log('quitting');
}

function exectuteQuery(query) {
    return this.influxDb.query(query);
}

function postQuery(query) {
    return this.influxDb.query(query.query);
}

function getHostRegExs() {
    let query = `SHOW TAG VALUES WITH KEY = "device"`;
    return this.exectuteQuery(query);    
    // let query = `SHOW TAG VALUES WITH KEY = "device"`;

    // return this.influxDb.query(query);
}

function getInterfaces() {
    return this.exectuteQuery(`SHOW TAG VALUES WITH KEY = "interface"`);
}

function getMetrics() {
     return this.exectuteQuery(`SHOW TAG VALUES WITH KEY = "type"`);
}

function getEgressIngressTraffic() {
    let query = `
SELECT derivative(mean("value"), 1s) 
FROM "jnpr.jvision" 
WHERE ("type" = 'egress_stats.if_packets' OR "type" = 'ingress_stats.if_packets') 
AND "device" =~ /vmx01:192\.168\.122\.7|vmx02:192\.168\.122\.9$/ AND "interface" =~ /ge-0\/0\/0\.0|ge-0\/0\/1\.0$/ 
AND time > 1494299695000ms and time < 1494310495000ms 
GROUP BY "device", "interface", "type", time(2m);`;

    //let query = `select * from "jnpr.jvision" where type = 'ingress_stats.if_packets'`;

    return this.influxDb.query(query);
}


InfluxDbProvider.prototype = {
    quit: quit,
    getEgressIngressTraffic: getEgressIngressTraffic,
    getHostRegExs: getHostRegExs,
    getInterfaces: getInterfaces,
    getMetrics: getMetrics,
    postQuery: postQuery
}
module.exports = InfluxDbProvider;
