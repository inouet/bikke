'use strict';

var FieldValueParser = function (str) {

    /**
     * format: fieldName/attributeType:value
     */
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

    /**
     * Retrieve value
     *
     * @returns {string}
     */
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

    /**
     * Retrieve fieldName
     *
     * @returns {string}
     */
    this.getField = function() {
        var str = this.getFieldAndOptions();
        if (str.indexOf("/")) {
            var arr = str.split("/");
            str = arr[0];
        }
        return str;
    };

    /**
     * Retrieve attributeType S|N
     *
     * @returns {string}
     */
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

module.exports = FieldValueParser;
