var Query = function (field, value, attributeType, operator) {

    this.field = '';
    this.value = '';
    this.operator = 'EQ';
    this.attributeType = 'S';

    this.setField = function (field) {
        if (field === undefined) {
            var err = new Error();
            err.message = "'field' is required to Query";
            throw err;
        }
        this.field = field;
    };

    this.setValue = function (value) {
        if (value === undefined) {
            var err = new Error();
            err.message = "'value' is required to Query";
            throw err;
        }

        this.value = value;
    };

    this.setOperator = function (operator) {
        this.operator =  operator || 'EQ';
    };

    this.setAttributeType = function (attributeType) {
        this.attributeType = attributeType || 'S';
    };

    this.setField(field);
    this.setValue(value);
    this.setOperator(operator);
    this.setAttributeType(attributeType);
};

module.exports = Query;
