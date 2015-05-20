var FieldValue = function (field, value, attributeType) {

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
            var err = new Error();
            err.message = "'value' is required to Query";
            throw err;
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

module.exports = FieldValue;

// TODO: これ、Attribute という名前の方がよい。

