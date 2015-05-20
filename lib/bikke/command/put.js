'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (tableName, valueList) {

    console.log("table_name:" +tableName);
    console.log("values");
    console.log(valueList);



    // Itemの組み立て
    // 下記のコード get.js からコピーしたので共通化可能 ----
    var item = {};

    for (var i = 0; i < valueList.length; i++) {
        var row = valueList[i];
        var obj = {};
        obj[row.attributeType] = row.value;
        item[row.field] = obj;
    }
    // ----------------------------------------------------

    var params = {
        TableName: tableName,
        Item: item
    };

    db.putItem(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
};

