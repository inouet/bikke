'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

var php = require('phpjs');
var marshaler = require('dynamodb-marshaler');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});
var docClient = new DOC.DynamoDB(db);

/**
 * Execute Get operation
 *
 * @param {string} tableName
 * @param {Array.<Query>} whereList
 * @param {Array.<string>} fieldList
 */
command.execute = function (tableName, key, fieldList) {

    var params = {};
    params.TableName = tableName;
    params.Key = key;

    // DynamoDB.getItem を実行
    docClient.getItem(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }

        if (!data.Item) {
            return true;
        }

        var item = data.Item;
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
