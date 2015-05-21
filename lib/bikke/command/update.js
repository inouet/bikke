'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (tableName, values) {

    console.log("table_name:" +tableName);
    console.log("values");
    console.log(values);

    var params = {
        TableName: tableName,
        Key: {
            "id": {"S": "1003"} // Hashキー
        },
        AttributeUpdates: {
            "price": {
                'Action': 'PUT',
                'Value': {"N": "30"}
            }
        }
    };

    db.updateItem(params, function (err, res) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }
        php.var_dump(res);
    });

};
