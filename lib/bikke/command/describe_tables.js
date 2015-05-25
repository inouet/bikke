'use strict';

var command = module.exports;
var AWS = require('aws-sdk');
var php = require('phpjs');

var dynamodb = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (table_name) {

    console.log("table_name: " + table_name);

    var params = {};
    params.TableName = table_name;

    dynamodb.describeTable(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }

        var table_info = {
            attr: {},
            gsi: {},
            lsi: {}
        };

        for (var i = 0; i < data.Table.AttributeDefinitions.length; i++) {
            var attr_name = data.Table.AttributeDefinitions[i].AttributeName;
            var attr_type = data.Table.AttributeDefinitions[i].AttributeType;
            table_info.attr[attr_name] = attr_type;
        }

        // GSI
        for (var i = 0; i < data.Table.GlobalSecondaryIndexes.length; i++) {
            var row = data.Table.GlobalSecondaryIndexes[i];

            // IndexName
            var index_name = row.IndexName;

            // KeySchema
            for (var j = 0; j < row.KeySchema.length; j++) {
                var attr_name = row.KeySchema[j].AttributeName;
                var key_type = row.KeySchema[j].KeyType;
                table_info.gsi[index_name] = {};
                table_info.gsi[index_name][attr_name] = key_type;
            }
        }

        // LSI
        for (var i = 0; i < data.Table.LocalSecondaryIndexes.length; i++) {
            var row = data.Table.LocalSecondaryIndexes[i];

            // IndexName
            var index_name = row.IndexName;

            // KeySchema
            table_info.lsi[index_name] = {};
            for (var j = 0; j < row.KeySchema.length; j++) {
                var attr_name = row.KeySchema[j].AttributeName;
                var key_type = row.KeySchema[j].KeyType;
                table_info.lsi[index_name][attr_name] = key_type;
            }
        }
        console.log(table_info);

    });
};

