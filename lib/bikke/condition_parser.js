'use strict';

var ConditionParser = function (str) {

    this.str = str;

    /**
     * Retrieve field,option string from query string
     *
     * @returns {string}
     */
    this.getFieldAndOptions = function () {
        var str = this.str;
        var array = str.split(":");
        return array[0];
    };

    this.getValue = function() {
        var str = this.str;
        var array = str.split(":");
        var value = null;

        if (array.length == 2) {
            value = array[1];
        } else if (array.length >= 3) {
            value = array.slice(1, array.length).join(":");
        }
        return value;
    };

    this.getField = function() {
        var str = this.getFieldAndOptions();
        if (str.indexOf("/")) {
            var arr = str.split("/");
            str = arr[0];
        }
        if (str.indexOf(".")) {
            var arr = str.split(".");
            str = arr[0];
        }
        return str;
    };

    this.getOperator = function() {
        var str = this.getFieldAndOptions();
        var r = str.match(/(\.EQ|\.LE|\.LT|\.GE|\.GT|\.BEGINS_WITH|\.BETWEEN)/i);
        if (r) {
            return r[0].replace('.', '').toUpperCase();
        }
        return 'EQ';
    };

    this.getAttributeType = function() {
        var str = this.getFieldAndOptions();
        if (str.match(/\/s/i)) {
            return 'S';
        }
        if (str.match(/\/n/i)) {
            return 'N';
        }
        return 'S'; // default
    };
};

module.exports = ConditionParser;
