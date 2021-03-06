var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var config   = require('../config').conf;

mongoose.connect(config.mongo);
mongoose.connection.on('error',function (err) {
    console.error('Mongoose连接失败: ' + err);
});

var RouteSchema = new Schema({
    routeId:String,
    auth   :Array,
    mac    :Array,
    plugin :Array
});

var Route = mongoose.model('Route', RouteSchema);

exports.getRoute = function(routeId, cb) {
    mongoose.model('Route').findOne({routeId: routeId})
    .exec(cb);
};

exports.getPassword = function(routeId, password, cb) {
    mongoose.model('Route')
    .findOne({routeId: routeId})
    .select('auth')
    .exec(function(err, data) {
        if(err) { cb(err); return; }
        if(!data) { cb('Find nothing'); return; }
        for(var i in data.auth) {
            if(data.auth[i].value === password) {
                cb(null, data.auth[i]);
                return;
            }
        }
        cb('Find nothing');
    });
};

exports.addPassword = function(routeId, password, cb) {
    mongoose.model('Route')
    .findOne({routeId: routeId}).exec(function(err, data) {
        if(err) { cb(err); return; }
        if(!data) { cb('Find nothing'); return; }
        data.auth.push(password);
        mongoose.model('Route')
        .findOneAndUpdate({
                routeId: routeId
            }, {auth: data.auth}, function(err, data) {
                if(err) { cb(err); return; }
                cb(null, password);
            }
        );
    });
};

exports.removePassword = function(routeId, password, cb) {
    mongoose.model('Route')
    .findOne({routeId: routeId}).exec(function(err, data) {
        if(err) { cb(err); return; }
        if(!data) { cb('Find nothing'); return; }
        for(var i in data.auth) {
            if(data.auth[i].value === password) {
                data.auth.splice(i, 1);
            }
        }
        mongoose.model('Route')
        .findOneAndUpdate({
                routeId: routeId
            }, {auth: data.auth}, cb
        );
    });
};

exports.getList = function(routeId, mac, cb) {
    mongoose.model('Route')
    .findOne({routeId: routeId})
    .select('mac')
    .exec(function(err, data) {
        if(err) { cb(err); return; }
        if(!data) { cb('Find nothing'); return; }
        data = JSON.parse(JSON.stringify(data));
        for(var i in data.mac) {
            if(data.mac[i].mac === mac) {
                cb(null, data.mac[i]);
                return;
            }
        }
        cb('Find nothing');
    });
};

exports.addRoute = function(routeId) {
    var route = new Route({ routeId: routeId });
    route.save(function (err) {
        if (err) return handleError(err);
        }
    );
};

exports.getPlugin = function(routeId, plugin, cb) {
    mongoose.model('Route')
    .findOne({routeId: routeId})
    .select('plugin')
    .exec(function(err, data) {
        if(err) { cb(err); return; }
        if(!data) { cb('Find nothing'); return; }
        for(var i in data.plugin) {
            if(data.plugin[i].name === plugin) {
                cb(null, data.plugin[i]);
                return;
            }
        }
        cb('Find nothing');
    });
};