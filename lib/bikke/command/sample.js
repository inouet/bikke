'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (table, limit) {

    var limit = limit || 3;

    var params = {};

    params.TableName = table;
    params.Select = "ALL_ATTRIBUTES";
    params.Limit = limit;

    db.scan(params, function (err, res) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }

        res.Items.forEach(display);
    });
};

function display(data) {
    for (var field in data) {
        var row = data[field];
        var cols = [];
        for (var attributeType in row) {
            var value = row[attributeType];

            cols.push(attributeType);
            cols.push(field);
            cols.push(value);

            console.log(cols.join(" "));
        }
    }
    console.log();
}
