
import { EventEmitter } from "@angular/core";
let eventEmitter1$: EventEmitter<string> = new EventEmitter<string>();
let eventEmitter2$: EventEmitter<string> = new EventEmitter<string>();

var draw2d = (<any>window).draw2d;
// var canvas = new draw2d.Canvas("network_topology_0", true);
var canvas_layout = {};

draw2d.layout.locator.topologyIconPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "draw2d.layout.locator.topologyIconPortLocator",
    init: function() {
        this._super();
    },
    relocate: function(index, figure) {
        var node = figure.getParent();
        var x = node.getWidth() / 2;
        var y = node.getHeight() / 2;
        this.applyConsiderRotation(figure, x, y);
    }
});
draw2d.layout.locator.BottomCenterLocator = draw2d.layout.locator.Locator.extend({
    NAME: "draw2d.layout.locator.BottomCenterLocator",
    init: function(parent)
    {
        this._super(parent);
    },
    relocate: function(index, target)
    {
        var parent = target.getParent();
        var boundingBox = parent.getBoundingBox();
        var targetBoundingBox = target.getBoundingBox();
        target.setPosition(boundingBox.w / 2 - targetBoundingBox.w / 2, parent.getHeight());
    }
});

draw2d.layout.locator.IpLabelLocator = draw2d.layout.locator.Locator.extend({
    NAME: "draw2d.layout.locator.IpLabelLocator",
    init: function(parent)
    {
        this._super(parent);
    },
    relocate: function(index, target)
    {
        var parent = target.getParent();
        var boundingBox = parent.getBoundingBox();
        var targetBoundingBox = target.getBoundingBox();
        target.setPosition(boundingBox.w / 2 - targetBoundingBox.w / 2, parent.getHeight() + 4);
    }
});

draw2d.shape.node.topologyIcon = draw2d.shape.basic.Image.extend({

    NAME: "draw2d.shape.node.topologyIcon",
    EDIT_POLICY: false,

    init: function(icon, width, height) {
        this._super(icon, width, height);
        var tpl = new draw2d.layout.locator.topologyIconPortLocator();
        this.createPort("hybrid", tpl);
    },
    setup: function(label, ip) {
        this.setUserData({});
        this.setIp(ip);
        this.setLabel(label);
    },

    setType: function(type) {
        var ud = this.getUserData();
        ud["type"] = type;
    },
    getType: function() {
        return this.getUserData()["type"];
    },

    setIp: function(ip) {
        var ud = this.getUserData();
        ud["ip"] = ip;
        if (this.ipLabel == undefined) {
            this.ipLabel = new draw2d.shape.basic.Label({text: "\n" + ip });
            this.ipLabel.setColor("#000");
            this.ipLabel.setFontColor("#000");
            this.ipLabel.setFontSize('16');
            this.ipLabel.setStroke(0);
            this.add(this.ipLabel, new draw2d.layout.locator.BottomCenterLocator(this));
        } else {
            this.ipLabel.text = "\n" + ip;
        }
    },
    getIp: function() {
        return this.getUserData()["ip"];
    },

    setLabel: function(label) {
        // console.log("setlabel " + label);
        var ud = this.getUserData();
        ud["label"] = label;
        if (this.label == undefined) {
            this.label = new draw2d.shape.basic.Label({text: label });
            this.label.setColor("#0d0d0d");
            this.label.setFontColor("#0d0d0d");
            this.label.setFontSize('16');
            this.label.setStroke(0);
            this.add(this.label, new draw2d.layout.locator.BottomCenterLocator(this));
        } else {
            this.label.text = label;
        }
    },
    getLabel: function() {
        return this.getUserData()["label"];
    },
    setPersistentAttributes: function(memento) {
    	this._super(memento);
    	this.setLabel(memento.userData.label);
    	this.setIp(memento.userData.ip);
    },
    getPersistentAttributes: function() {
        // force grabbing the mgnt interface
        var ud = this.getUserData();
        return this._super();
    },
    setupObject: function(type, label, width, height) {
        this.setDimension(width, height);
        var tpl = new draw2d.layout.locator.topologyIconPortLocator();
        this.createPort("hybrid", tpl);
        this.setType(type);
        this.setLabel(label);
    },

    // override default dc handler
    onDoubleClick: function() {
        console.log('DBLCLICK');
        loadDeviceDetails(this.getLabel());
        return;
    }

});

var externalCloudLabelLocator = draw2d.layout.locator.Locator.extend({
    NAME: "externalCloudLabelLocator",
    init: function(parent)
    {
        this._super(parent);
    },
    relocate: function(index, target)
    {
        var parent = target.getParent();
        var boundingBox = parent.getBoundingBox();
        var targetBoundingBox = target.getBoundingBox();
        target.setPosition(boundingBox.w / 2 - targetBoundingBox.w / 2, parent.getHeight() - 45);
    }
});
draw2d.shape.node.TopologyLinkCloud = draw2d.shape.icon.Cloud2.extend({
    NAME: "draw2d.shape.node.TopologyLinkCloud",
    EDIT_POLICY: false,
    init: function(label) {
        this._super();
        this.setUserData({});
        this.setup(label);
    },
    setup: function(label) {
        // var pl = new externalCloudPortLocator();
        //  this.createPort("hybrid", pl);
        this.setLabel(label);
    },
    setLabel: function(label) {
        var ud = this.getUserData();
        ud["label"] = label;
        var l = new draw2d.shape.basic.Label({ text: label });
        l.setColor("#000");
        l.setFontColor("#000");
        l.setStroke(0);
        this.add(l, new externalCloudLabelLocator(this), 1);
    },
    getLabel: function() {
        return this.getUserData()["label"]
    },
    setPersistentAttributes: function(memento) {
        this._super(memento);
        this.setLabel(memento.userData.label);
    },
    // override default dc handler
    onDoubleClick: function() {
        var canvas = this.getCanvas();
        var canvasId = canvas.canvasId;
        console.log('dblclick ' + canvasId + ' ' + this.getLabel());
        loadTopology(this.getLabel());
    }
});

function getTopologyJson(canvas:any) {
    var writer = new draw2d.io.json.Writer();
    var data = "";
    writer.marshal(canvas, function(json) {
        // convert the json object into string representation
        data = JSON.stringify(json, null, 2);
    });
    return data;
}

function renderTopology(canvas:any, topologyJson:any) {

    canvas.clear();
    canvas_layout = reset_canvas_layout();

    console.log(topologyJson);
    var j = JSON.parse(topologyJson);
    var reader = new draw2d.io.json.Reader();
    reader.unmarshal(canvas, j);
}

function addIcon(canvas:any) {
    alert('hello world');
}

function renderTopologyList(canvas, topologyList) {

    canvas.clear();
    canvas_layout = reset_canvas_layout();

    var j = JSON.parse(topologyList);

    for (var i = 0; i<j.length; i++) {
        var o = j[i];
        console.log(o);
        var cloud = getCloudIcon(o);
        cloud.width = 100;
        cloud.height = 100;
        var c = get_layout_for_icon();
        canvas.add(cloud, c['left'], c['top']);
    }
}

function get_layout_for_icon() {
    // determine where on the canvas to put this icon
    // i.e. don't overlap them
    var wrap_limit = 8;
    var icon_offset = 120;
    console.log(canvas_layout);
    if (! canvas_layout.hasOwnProperty('num_instances')) {
        console.log('resetting now');
        canvas_layout = reset_canvas_layout();
    }

    var c = canvas_layout;

    console.log(c);

    console.log('adding one');
    c['num_instances'] += 1;
    c['left'] += 120;
    c['top'] += 0;

    if (c['num_instances'] > wrap_limit) {
        c['left'] = 25;
        c['top'] += icon_offset;
        c['num_instances'] = 1;
        c['total_offset'] += 110;
    }

    return c;
}

function reset_canvas_layout() {
    var config = {
            'num_instances': 0,
            'left': -25,
            'top': 25,
            'total_offset': 100
        };
    return config;
}
function addIconToCanvas(canvas, z) {
        var c = get_layout_for_icon();
        canvas.add(z, c['left'], c['top']);

}

function loadTopology(topologyName) {
    eventEmitter1$.emit(topologyName);
}

function loadDeviceDetails(deviceName) {
    eventEmitter2$.emit(deviceName);
}


function getDeviceIcon(label: any, ip: any, icon_name:any, icon_width:any, icon_height:any) {
    // return new draw2d.shape.node.topologyIcon({ 'path': icon_name, 'width': icon_width, 'height': icon_height });
    var z =  new draw2d.shape.node.topologyIcon({ path: icon_name, width: icon_width, height: icon_height });
    z.setup(label, ip);
    return z;
}

function getCloudIcon(label: any) {
    return new draw2d.shape.node.TopologyLinkCloud(label);
}

function addCloud(canvas) {
    console.log('got it');
    // addCloud_old(canvas, draw2d);          

    var c = getCloudIcon('hi there');
    canvas.add(c);
}

function getDraw2d() {
    return draw2d;
}

export const TopologyProvider = Object.freeze({
    addIcon: addIcon,
    addCloud: addCloud,
    getCloudIcon: getCloudIcon,
    getDeviceIcon: getDeviceIcon,
    eventEmitter1: eventEmitter1$,
    eventEmitter2: eventEmitter2$,
    renderTopology: renderTopology,
    getTopologyJson: getTopologyJson,
    addIconToCanvas: addIconToCanvas,
    renderTopologyList: renderTopologyList,
    getDraw2d: getDraw2d
});
