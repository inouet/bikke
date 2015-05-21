'use strict';

var AttributeParser = function (str) {

    /**
     * format: fieldName/attributeType:value
     */
    this.str = str;

    /**
     * Retrieve field,option string from query string
     *
     * @returns {string}
     */
    this.getNameAndOptions = function () {
        var str = this.str;
        var array = str.split(":");
        return array[0];
    };

    /**
     * Retrieve attributeValue
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
     * Retrieve attributeName
     *
     * @returns {string}
     */
    this.getName = function() {
        var str = this.getNameAndOptions();
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
    this.getType = function() {
        var str = this.getNameAndOptions();
        if (str.match(/\/s/i)) {
            return 'S';
        }
        if (str.match(/\/n/i)) {
            return 'N';
        }
        return 'S'; // default
    };
};

module.exports = AttributeParser;
