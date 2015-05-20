'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (tableName, limit) {

    var limit_param = limit || 3;

    var params = {
        TableName: tableName,
        Select: "ALL_ATTRIBUTES",
        Limit: limit_param
    };

    db.scan(params, function (err, res) {
        if (err) {
            php.var_dump(err);
            return false;
        }
        //php.var_dump(res.Items);
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

