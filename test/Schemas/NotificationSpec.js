'use strict';

const _ = require('lodash');
const expect = require('../Helpers/expect');

const{ ConfigurationError } = require('../../src/Errors');
const NotificationSchema = require('../../src/Schemas/Notification');
const SchemaValidator = require('../../src/Services/SchemaValidator');
const samples = require('../Helpers/Samples');

describe('Schemas/Notification', () => {
    let schemaValidator;

    const test = (promise, details) => expect(promise).to.be.eventually.rejectedWith(Error)
        .that.is.instanceOf(ConfigurationError)
        .and.have.property('details').that.deep.equals(details);

    before(() => {
        schemaValidator = new SchemaValidator(NotificationSchema);
    });

    describe('validate', () => {
        _.forEach(Object.keys(samples), platform => {
            it(`should accept a valid ${platform} notification request`, () =>
                expect(schemaValidator.validate(samples[platform])).to.be.eventually.fulfilled);
        });

        it('should throw an error when missing a required property', () => {
            const promise = schemaValidator.validate(
                _.omit(samples.email, ['platform', 'destination', 'message']),
            );

            test(promise, [
                {
                    keyword: 'required',
                    dataPath: '',
                    params: {
                        missingProperty: 'platform',
                    },
                    message: 'should have required property \'platform\'',
                },
                {
                    keyword: 'required',
                    dataPath: '',
                    params: {
                        missingProperty: 'destination',
                    },
                    message: 'should have required property \'destination\'',
                },
                {
                    keyword: 'required',
                    dataPath: '',
                    params: {
                        missingProperty: 'message',
                    },
                    message: 'should have required property \'message\'',
                },
            ]);
        });

        it('should throw an error when adding additional property', () => {
            const invalidEmail = _.cloneDeep(samples.email);
            invalidEmail.invalidProp = '123';
            invalidEmail.message.invalidProp = '456';
            invalidEmail.message.content.invalidProp = '789';

            const promise = schemaValidator.validate(invalidEmail);
            test(promise, [
                {
                    keyword: 'additionalProperties',
                    dataPath: '',
                    params: {
                        additionalProperty: 'invalidProp',
                    },
                    message: 'should NOT have additional properties',
                },
                {
                    keyword: 'additionalProperties',
                    dataPath: '.message',
                    params: {
                        additionalProperty: 'invalidProp',
                    },
                    message: 'should NOT have additional properties',
                },
                {
                    keyword: 'additionalProperties',
                    dataPath: '.message.content',
                    params: {
                        additionalProperty: 'invalidProp',
                    },
                    message: 'should NOT have additional properties',
                },
            ]);
        });

        it('should throw an error when type is invalid', () => {
            const promise = schemaValidator.validate([]);
            test(promise, [{
                keyword: 'type',
                dataPath: '',
                params: {
                    type: 'object',
                },
                message: 'should be object',
            }]);
        });

        it('should throw an error when destination is invalid', () => {
            const invalidEmail = _.cloneDeep(samples.email);
            invalidEmail.destination = 123;

            const promise = schemaValidator.validate(invalidEmail);
            test(promise, [
                {
                    keyword: 'type',
                    dataPath: '.destination',
                    params: {
                        type: 'array',
                    },
                    message: 'should be array',
                },
                {
                    keyword: 'type',
                    dataPath: '.destination',
                    params: {
                        type: 'string',
                    },
                    message: 'should be string',
                },
                {
                    keyword: 'oneOf',
                    dataPath: '.destination',
                    params: {
                        passingSchemas: null,
                    },
                    message: 'should match exactly one schema in oneOf',
                },
                {
                    keyword: 'type',
                    dataPath: '.destination',
                    params: {
                        type: 'array',
                    },
                    message: 'should be array',
                },
                {
                    keyword: 'type',
                    dataPath: '.destination',
                    params: {
                        type: 'string',
                    },
                    message: 'should be string',
                },
                {
                    keyword: 'oneOf',
                    dataPath: '.destination',
                    params: {
                        passingSchemas: null,
                    },
                    message: 'should match exactly one schema in oneOf',
                },
                {
                    keyword: 'oneOf',
                    dataPath: '.destination',
                    params: {
                        passingSchemas: null,
                    },
                    message: 'should match exactly one schema in oneOf',
                },
            ]);
        });

        it('should throw error when property type is invalid', () => {
            const invalidEmail = _.cloneDeep(samples.email);
            invalidEmail.message.content.subject = 123;
            invalidEmail.message.content.text = 456;

            const promise = schemaValidator.validate(invalidEmail);
            test(promise, [
                {
                    keyword: 'type',
                    dataPath: '.message.content.subject',
                    params: {
                        type: 'string',
                    },
                    message: 'should be string',
                },
                {
                    keyword: 'type',
                    dataPath: '.message.content.text',
                    params: {
                        type: 'string',
                    },
                    message: 'should be string',
                },
            ]);
        });

        it('should throw an error if string length is less than 1', () => {
            const invalidEmail = _.cloneDeep(samples.email);
            invalidEmail.message.content.subject = '';

            const promise = schemaValidator.validate(invalidEmail);
            test(promise, [
                {
                    keyword: 'minLength',
                    dataPath: '.message.content.subject',
                    params: {
                        limit: 1,
                    },
                    message: 'should NOT be shorter than 1 characters',
                },
            ]);
        });
    });
});
