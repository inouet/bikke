var Attribute = function (field, value, attributeType) {

    this.field = '';
    this.value = '';
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
            throw new Error('"value" is required to Query');
        }

        this.value = value;
    };

    this.setAttributeType = function (attributeType) {
        this.attributeType = attributeType || 'S';
    };

    this.setField(field);
    this.setValue(value);
    this.setAttributeType(attributeType);
};

module.exports = Attribute;

