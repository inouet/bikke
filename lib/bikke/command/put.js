'use strict';

var command = module.exports;

var DOC = require("dynamodb-doc");

command.execute = function (db, tableName, item) {
    var docClient = new DOC.DynamoDB(db);

    var params = {};
    params.TableName = tableName;
    params.Item = item;

    docClient.putItem(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        }
        //console.log(data);
    });
};
