'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

command.execute = function (db, tableName, where) {

    var docClient = new DOC.DynamoDB(db);

    var params = {};

    params.TableName = tableName;
    params.Key = where;

    console.log(params);

    docClient.deleteItem(params, function (err, res) {
        console.log(err);
        console.log(res);
    });
};
