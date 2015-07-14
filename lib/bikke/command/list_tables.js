'use strict';

var command = module.exports;

var DynamoDB = require('../dynamodb');

command.execute = function (db) {

    var params = {};
    db.listTables(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        } else {
            for (var i = 0; i < data.TableNames.length; i++) {
                console.log(data.TableNames[i]);
            }
        }
    });
};
