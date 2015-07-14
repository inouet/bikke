'use strict';

var command = module.exports;

var DOC = require("dynamodb-doc");
//var marshaler = require('dynamodb-marshaler');

command.execute = function (db, tableName, item, keys) {
    var docClient = new DOC.DynamoDB(db);
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
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }
    });
};
