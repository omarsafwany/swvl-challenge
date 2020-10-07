'use strict';

const expect = require('../Helpers/expect');
const Sample = require('../Helpers/Samples').sms;

const{ SMS } = require('../../src/Platforms');
const{ ConfigurationError } = require('../../src/Errors');

describe('Platforms/SMS', () => {
    let sms;

    before(() => {
        sms = new SMS();
    });

    describe('constructor', () => {
        it('should create a SMS instance', () =>
            expect(sms).to.be.instanceOf(SMS),
        );
    });

    describe('send', () => {
        it('should send a sms notification', async() => {
            const response = await sms.send(Sample.message, Sample.destination);
            expect(response).to.be.an('array').that.has.lengthOf(Sample.destination.length);
            response.forEach((item, index) => {
                expect(item).to.be.an('object').that.has.keys(['status', 'value']);
                expect(item.status).to.be.equal('fulfilled');
                expect(item.value).to.deep.equal({
                    to: Sample.destination[index],
                    message: Sample.message,
                });
            });
        });

        it('should throw an error when message is invalid', () => {
            const fn = () => sms.send(123, Sample.destination);
            expect(fn).to.throw(Error).that.is.instanceOf(ConfigurationError)
                .and.have.property('message')
                .that.equals('missing message and/or destination');
        });

        it('should throw an error when destination is missing', () => {
            const fn = () => sms.send(Sample.message);
            expect(fn).to.throw(Error).that.is.instanceOf(ConfigurationError)
                .and.have.property('message')
                .that.equals('missing message and/or destination');
        });
    });
});
