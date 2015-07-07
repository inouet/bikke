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

function validateRequired(object, required) {
    required.forEach(function (name) {
        var value = object[name];
        if (value === undefined || value == '') {
            console.error();
            console.error("  error: option `--" + name + "' argument missing");
            console.error();
            process.exit(1);
        }
    });
}

/**
 * File to Object
 *
 * @param   file
 * @returns object {}
 */
function collectAttributesFromFile(file) {
    var fs = require('fs');
    var object = {};

    var contents = fs.readFileSync(file);
    var lines = contents.toString().split('\n');
    var i, len;

    for (i = 0, len = lines.length - 1; i < len; i++) {
        var line   = lines[i];
        var parser = new AttributeParser(line);
        var type   = parser.getType();
        var name   = parser.getName();
        var value  = parser.getValue();

        if (name.length == 0 || value.length == 0) {
            continue;
        }
        object[name] = formatValue(type, value);
    }
    return object;
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
        .description('Execute "GetItem" operation')
        .option("--table <table-name>", "Table Name")
        .option("--where <field:value>", "Hash/Range Key", collectKeys, {})
        .option("--field <field>", "Fields", list, [])
        .action(function (options) {
            var required = ['table', 'where', 'field'];
            validateRequired(options, required);

            var command = require('./command/get');
            command.execute(options.table, options.where, options.field);
        });

    //--------------------------------
    // query
    //      --table
    //      --where
    //      --field
    //      --index-name
    //      --limit
    //      --format ltsv|tsv|ssv
    //--------------------------------
    commander
        .command('query')
        .description('Execute "Query" operation')
        .option("--table <table-name>", "Table Name")
        .option("--where <field:value>", "Hash/Range Key", collectConditions, [])
        .option("--field <field>", "Fields", list, [])
        .option("--index-name <index-name>", "Index Name")
        .option("--limit <limit>", "Limit")
        .action(function (options) {

            var required = ['table', 'where', 'field'];
            validateRequired(options, required);

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
        .description('Execute "PutItem" operation')
        .option("--table <table-name>", "Table Name")
        .option("--set <field:value>", "Field/Type:Value", collectAttributes, {})
        .option("--file <file>", "File")
        .action(function (options) {
            var required = ['table', 'set'];
            validateRequired(options, required);

            if (options.file !== undefined) {
                var values = collectAttributesFromFile(options.file);
            } else {
                var values = options.set;
            }
            var command = require('./command/put');
            command.execute(options.table, values);
        });

    //--------------------------------
    // update
    //      --table
    //      --where
    //      --set
    //      --file
    //--------------------------------
    commander
        .command('update')
        .description('Execute "UpdateItem" operation')
        .option("--table <table-name>", "Table Name")
        .option("--where <field:value>", "Hash/Range Key", collectKeys, {})
        .option("--file <file>", "File")
        .option("--set <field:value>", "Field/Type:Value", collectAttributes, {})
        .action(function (options) {

            var required = ['table', 'where'];
            validateRequired(options, required);

            if (options.file !== undefined) {
                var values = collectAttributesFromFile(options.file);
            } else {
                var values = options.set;
            }

            var command = require('./command/update');
            command.execute(options.table, values, options.where);
        });

    //--------------------------------
    // delete
    //      --table
    //      --where
    //--------------------------------

    commander
        .command('delete')
        .description('Execute "DeleteItem" operation')
        .option("--table <table-name>", "Table Name")
        .option("--where <hash-or-range-key>", "Hash/Range Key", collectKeys, {})
        .action(function (options) {

            var required = ['table', 'where'];
            validateRequired(options, required);

            var command = require('./command/delete');
            command.execute(options.table, options.where);
        });

    //--------------------------------
    // scan
    //      --table
    //      --limit
    //--------------------------------
    commander
        .command('scan')
        .description('Execute "Scan" operation')
        .option("--table <table-name>", "Table Name")
        .option("--limit <count>", "Limit")
        .action(function (options) {

            var required = ['table'];
            validateRequired(options, required);

            var command = require('./command/scan');
            command.execute(options.table);
        });

    //--------------------------------
    // list-tables
    //--------------------------------
    commander
        .command('list-tables')
        .description('Execute "ListTables" operation')
        .action(function (options) {
            var command = require('./command/list_tables');
            command.execute();
        });

    //--------------------------------
    // describe-table
    //--------------------------------
    commander
        .command('describe-table')
        .description('Execute "DescribeTable" operation')
        .option("--table <table-name>", "Table Name")
        .action(function (options) {

            var required = ['table'];
            validateRequired(options, required);

            var command = require('./command/describe_tables');
            command.execute(options.table);
        });

    //--------------------------------
    // sample
    //      --table
    //      --limit
    //--------------------------------
    commander
        .command('sample')
        .description('Output sample data')
        .option("--table <table-name>", "Table Name")
        .option("--limit <count>", "Limit")
        .action(function (options) {

            var required = ['table'];
            validateRequired(options, required);

            var command = require('./command/sample');
            command.execute(options.table, options.limit);
        });

    // execute
    commander.parse(process.argv);
};
