'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

//var marshaler = require('dynamodb-marshaler');

/**
 * Execute Get operation
 *
 * @param {String} tableName
 * @param {Array.<Query>} key
 * @param {Array.<string>} fieldList
 */
command.execute = function (db, tableName, key, fieldList) {

    var docClient = new DOC.DynamoDB(db);

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
