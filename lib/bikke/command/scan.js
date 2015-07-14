'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
//var marshaler = require('dynamodb-marshaler');

command.execute = function (db, tableName, limit) {

    var limit_param = limit || 3;
    var params = {};

    params.TableName = tableName;
    params.Select = "ALL_ATTRIBUTES";
    params.Limit = limit_param;

    db.scan(params, function (err, res) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }
        res.Items.forEach(display);
    });
};

function display(data) {

    // http://yslibr4ry.blogspot.jp/2012/11/javascriptobjectobjectkeys.html
    // あとで直す

    for (var field in data) {
        var row = data[field];
        var cols = [];
        for (var attributeType in row) {
            var value = row[attributeType];

            cols.push(field);
            cols.push(attributeType);
            cols.push(value);

            console.log(cols.join(" "));
        }
    }
    console.log();
}

