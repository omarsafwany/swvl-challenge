'use strict';

const _ = require('lodash');
const{ ConfigurationError } = require('../Errors');
const Ajv = require('ajv');

class SchemaValidator  {

    constructor(schema) {
        this.schemas = _.isArray(schema) ? schema : [schema];
        if(_.isNil(this.ajvValidate)) {
            this._createValidatorInstance();
        }
    }

    validate(doc) {
        const validationResult = this.ajvValidate(doc);
        if(validationResult) {
            return Promise.resolve(doc);
        }

        const errorObject = new ConfigurationError('input does not match schema');
        errorObject.details = this._formatErrors(this.ajvValidate.errors);

        return Promise.reject(errorObject);
    }

    _createValidatorInstance() {
        const ajv = new Ajv({
            v5: true, allErrors: true, useDefaults: true, extendRefs: true, $data: true,
        });

        const lastSchema = _.last(this.schemas);
        const schemas = _.dropRight(this.schemas);

        if(!_.isEmpty(schemas)) {
            ajv.addSchema(schemas);
        }

        this.ajvValidate = ajv.compile(lastSchema);
    }

    _formatErrors(errorsArray) {
        return _.map(errorsArray, anError => _.omit(anError, 'schemaPath'));
    }

}

module.exports = SchemaValidator;
