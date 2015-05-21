'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});

/**
 * Execute Get operation
 *
 * @param {string} tableName
 * @param {Array.<Query>} whereList
 * @param {Array.<string>} fieldList
 */
command.execute = function (tableName, whereList, fieldList) {

    // 検索式を組み立て
    // ----------------------------------------------------
    var key = {};
    for (var i = 0; i < whereList.length; i++) {
        var row = whereList[i];
        var obj = {};
        obj[row.attributeType] = row.value;
        key[row.field] = obj;
    }
    // ----------------------------------------------------

    var params = {};
    params.TableName = tableName;
    params.Key = key;

    // DynamoDB.getItem を実行
    db.getItem(params, function (err, res) {

        if (err) {
            php.var_dump(err);
            return false;
        }

        if (!res.Item) {
            return false;
        }

        var item = marshaler.unmarshalItem(res.Item);

        var cols = [];
        fieldList.forEach(function (row) {
            var value = item[row];
            if (value === undefined || value === null) {
                value = '_'; // TODO
            }
            cols.push(value);
        });

        // output
        console.log(cols.join(" "));
    });
};
