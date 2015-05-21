'use strict';

var cli = module.exports;

var commander = require('commander');
var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

var ConditionParser = require('./condition_parser');
var AttributeParser = require('./attribute_parser');

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});
var docClient = new DOC.DynamoDB(db);

function list(string) {
    return string.split(',');
}

function collectConditions(string, array) {
    var parser = new ConditionParser(string);

    var type = parser.getAttributeType();
    var name = parser.getField();
    var operator = parser.getOperator();
    var value = parser.getValue();

    value = formatValue(type, value);

    var condition = docClient.Condition(name, operator, value);
    array.push(condition);
    return array;
}

function collectKeys(string, object) {
    var parser = new ConditionParser(string);

    var type = parser.getAttributeType();
    var name = parser.getField();
    var value = parser.getValue();

    value = formatValue(type, value);

    object[name] = value;
    return object;
}

function collectAttributes(string, object) {
    var parser = new AttributeParser(string);

    var type = parser.getType();
    var name = parser.getName();
    var value = parser.getValue();

    object[name] = formatValue(type, value);

    return object;
}

function formatValue(type, value) {
    switch (type) {
        case "N":
            return Number(value);
        default:
            return value;
    }
}

cli.run = function () {

    //--------------------------------
    // get
    //      --table
    //      --where
    //      --field
    //      --format ltsv|tsv|ssv
    //--------------------------------
    commander
        .command('get')
        .description('get variable')
        .option("--table <table-name>", "Table Name")
        .option("--where <hash-or-range-key>", "Hash/Range Key", collectKeys, {})
        .option("--field <field>", "Fields", list, [])
        .action(function (options) {
            var command = require('./command/get');
            command.execute(options.table, options.where, options.field);
        });

    //--------------------------------
    // query
    //      --table
    //      --where
    //      --index-name
    //      --field
    //      --limit
    //      --format ltsv|tsv|ssv
    //--------------------------------
    commander
        .command('query')
        .description('get variable')
        .option("--table <table-name>", "Table Name")
        .option("--where <hash-or-range-key>", "Hash/Range Key", collectConditions, [])
        .option("--field <field>", "Fields", list, [])
        .option("--index-name <index-name>", "Index Name")
        .option("--limit <limit>", "Limit")
        .action(function (options) {

            var command = require('./command/query');
            command.execute(options.table, options.where, options.field, options.indexName);
        });

    //--------------------------------
    // put
    //      --table
    //      --set
    //      --file
    //--------------------------------
    commander
        .command('put')
        .description('put record')
        .option("--table <table-name>", "Table Name")
        .option("--set <key-value>", "Field/Type:Value", collectAttributes, {})
        .option("--file <file>", "File")
        .action(function (options) {

            var command = require('./command/put');
            command.execute(options.table, options.set);
        });

    //--------------------------------
    // update
    //      --table
    //      --hash-key
    //      --range-key
    //      --file
    //      --value
    //--------------------------------
    commander
        .command('update')
        .description('update record')
        .option("--table <table-name>", "Table Name")
        .option("--hash-key <hash-key>", "Hash Key")
        .option("--range-key <range-key>", "Range Key")
        .option("--file <file>", "File")
        .option("--set <key-value>", "Field/Type:Value", collectAttributes, {})
        .action(function (options) {
            var command = require('./command/update');
            command.execute(options.table, options.hashKey, options.rangeKey, options.set);
        });

    //--------------------------------
    // Delete
    //--------------------------------

    //--------------------------------
    // Scan
    //--------------------------------
    commander
        .command('scan')
        .description('Scan Table')
        .option("--table <table-name>", "Table Name")
        .action(function (options) {
            var command = require('./command/scan');
            command.execute(options.table);
        });


    //--------------------------------
    // Sample
    //--------------------------------
    commander
        .command('sample')
        .description('Output sample data')
        .option("--table <table-name>", "Table Name")
        .option("--limit <count>", "Limit")
        .action(function (options) {
            var command = require('./command/sample');
            command.execute(options.table, options.limit);
        });


    //--------------------------------
    // describe-tables
    //--------------------------------
    commander
        .command('describe-table')
        .description('update record')
        .option("--table <table-name>", "Table Name")
        .action(function (options) {
            var command = require('./command/describe_tables');
            command.execute(options.table);
        });

    // execute
    commander.parse(process.argv);
};
