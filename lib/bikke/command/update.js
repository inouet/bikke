'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});
var docClient = new DOC.DynamoDB(db);

command.execute = function (tableName, item, keys) {

    var expressionList = [];
    var attributeValueList = {};

    for (var key in item) {
        var stmt = ":" + key;
        expressionList.push(key + " = " + stmt);
        attributeValueList[stmt] = item[key];
    }

    var updateExpression = "set " + expressionList.join(", ");


    var params = {};
    params.TableName = tableName;
    params.Key = keys;
    params.UpdateExpression = updateExpression;
    params.ExpressionAttributeValues = attributeValueList;

    docClient.updateItem(params, function (err, res) {
        console.log(err);
        if (err) {
            // console.error('uncaughtException: ' + err.stack);
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }
        php.var_dump(res);
    });
};

