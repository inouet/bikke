'use strict';

var command = module.exports;
var AWS = require('aws-sdk');
var php = require('phpjs');

var dynamodb = new AWS.DynamoDB({region: 'ap-northeast-1'});

command.execute = function (table_name) {

    //console.log("table_name: " + table_name);

    var params = {};
    params.TableName = table_name;

    dynamodb.describeTable(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }

        var table_info = {
            idx: {},
            attr: {},
            gsi: {},
            lsi: {}
        };

        //php.var_dump(data.Table);
        //return true;

        // KeySchema
        for (var i = 0; i < data.Table.KeySchema.length; i++) {
            var attr_name = data.Table.KeySchema[i].AttributeName;
            var key_type = data.Table.KeySchema[i].KeyType;
            table_info.idx[key_type] = attr_name;
        }

        for (var i = 0; i < data.Table.AttributeDefinitions.length; i++) {
            var attr_name = data.Table.AttributeDefinitions[i].AttributeName;
            var attr_type = data.Table.AttributeDefinitions[i].AttributeType;
            table_info.attr[attr_name] = attr_type;
        }

        // GlobalSecondaryIndex
        if (data.Table.GlobalSecondaryIndexes) {
            for (var i = 0; i < data.Table.GlobalSecondaryIndexes.length; i++) {
                var row = data.Table.GlobalSecondaryIndexes[i];

                // IndexName
                var index_name = row.IndexName;

                // KeySchema
                table_info.gsi[index_name] = {};
                for (var j = 0; j < row.KeySchema.length; j++) {
                    var attr_name = row.KeySchema[j].AttributeName;
                    var key_type = row.KeySchema[j].KeyType;

                    table_info.gsi[index_name][key_type] = attr_name;
                }
            }
        }

        // LocalSecondaryIndexes
        // console.log(data.Table);

        if (data.Table.LocalSecondaryIndexes) {
            for (var i = 0; i < data.Table.LocalSecondaryIndexes.length; i++) {
                var row = data.Table.LocalSecondaryIndexes[i];

                // IndexName
                var index_name = row.IndexName;

                // KeySchema
                table_info.lsi[index_name] = {};
                for (var j = 0; j < row.KeySchema.length; j++) {
                    var attr_name = row.KeySchema[j].AttributeName;
                    var key_type = row.KeySchema[j].KeyType;
                    table_info.lsi[index_name][key_type] = attr_name;
                }
            }
        }
        //console.log(table_info);

        display(table_info);

    });
};

function display(table_info) {
    // Format
    var rows = [];

    //
    // Header
    //
    var header = ['IndexType', 'IndexName', 'Hash',	'HashType', 'Range', 'RangeType'];
    rows.push(header);

    //
    // Index
    //
    var col = ['PrimaryIndex', '_', table_info.idx.HASH, table_info.attr[table_info.idx.HASH]];
    if (table_info.idx.RANGE) {
        col[4] = table_info.idx.RANGE;
        col[5] = table_info.attr[table_info.idx.RANGE];
    } else {
        col[4] = '_';
        col[5] = '_';
    }
    rows.push(col);

    //
    // GlobalSecondaryIndex
    //
    if (table_info.gsi) {
        for (var i = 0; i < table_info.gsi.length; i++) {
        }
    }

    // Display
    for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].join(" "));
    }
}
