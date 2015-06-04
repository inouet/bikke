'use strict';

var command = module.exports;

var AWS = require('aws-sdk');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function () {

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
