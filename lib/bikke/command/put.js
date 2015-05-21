'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});
var docClient = new DOC.DynamoDB(db);

command.execute = function (tableName, item) {

    var params = {};
    params.TableName = tableName;
    params.Item = item;

    docClient.putItem(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        } else {
            console.log(data);
        }
    });
};

