'use strict';

var cli = module.exports;
var commander = require('commander');
var Query = require('./query');
var QueryParser = require('./query_parser');
var AttributeParser = require('./attribute_parser');
//var Attribute = require('./attribute');

function list(string) {
    return string.split(',');
}

function collect_query(string, array) {
    var parser = new QueryParser(string);

    var attributeType = parser.getAttributeType();
    var field = parser.getField();
    var operator = parser.getOperator();
    var value = parser.getValue();

    var query = new Query(field, value, attributeType, operator);
    array.push(query);
    return array;
}


function collectAttributes(string, object) {
    var parser = new AttributeParser(string);

    var type = parser.getType();
    var name = parser.getName();
    var value = parser.getValue();

    //var attribute = new Attribute(name, value, type);
    //array.push(attribute);

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
    //      --hash-key
    //      --range-key
    //      --field
    //      --format ltsv|tsv|ssv
    //--------------------------------
    commander
        .command('get')
        .description('get variable')
        .option("--table <table-name>", "Table Name")
        .option("--where <hash-or-range-key>", "Hash/Range Key", collect_query, [])
        .option("--field <field>", "Fields", list, [])
        .action(function (options) {
            var command = require('./command/get');
            command.execute(options.table, options.where, options.field);
        });

    //--------------------------------
    // query
    //      --table
    //      --hash-key
    //      --range-key
    //      --index-name
    //      --field
    //      --format ltsv|tsv|ssv
    //--------------------------------
    commander
        .command('query')
        .description('get variable')
        .option("--table <table-name>", "Table Name")
        .option("--where <hash-or-range-key>", "Hash/Range Key", collect_query, [])
        .option("--index-name <index-name>", "Index Name")
        .option("--limit <limit>", "Limit")
        .action(function (options) {

            console.log("HashKey = " + options.hashKey);
            console.log("RangeKey = " + options.rangeKey);
            console.log("IndexName = " + options.indexName);

        });

    //--------------------------------
    // put
    //      --table
    //      --hash-key
    //      --range-key
    //      --file
    //      --set
    //--------------------------------
    commander
        .command('put')
        .description('put record')
        .option("--table <table-name>", "Table Name")
        .option("--file <file>", "File")
        .option("--set <key-value>", "Field/Type:Value", collectAttributes, {})
        .action(function (options) {

            console.log(options.set);

            var command = require('./command/put');
            command.execute(options.table, options.set);

            //console.log(options);

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
