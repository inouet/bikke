'use strict';

var command = module.exports;



var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

var docClient = new DOC.DynamoDB(db);

command.execute = function (tableName, where) {

    //console.log("table_name:" +tableName);
    //console.log(where);

    var params = {};

    params.TableName = tableName;
    params.Key = where;

    console.log(params);

    //return;


    docClient.deleteItem(params, function (err, res) {
        console.log(err);
        console.log(res);
    });
};
