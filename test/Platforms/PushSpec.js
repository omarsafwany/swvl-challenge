'use strict';

const expect = require('../Helpers/expect');
const Sample = require('../Helpers/Samples').push;

const{ Push } = require('../../src/Platforms');
const{ ConfigurationError } = require('../../src/Errors');

describe('Platforms/Push', () => {
    let push;

    before(() => {
        push = new Push();
    });

    describe('constructor', () => {
        it('should create a Push instance', () =>
            expect(push).to.be.instanceOf(Push),
        );
    });

    describe('send', () => {
        it('should send a push notification', async() => {
            const response = await push.send(Sample.message, Sample.destination);
            expect(response).to.be.an('array').that.has.lengthOf(1);
            expect(response[0]).to.be.an('object').that.has.keys(['status', 'value']);
            expect(response[0].status).to.be.equal('fulfilled');
            expect(response[0].value).to.deep.equal({
                to: Sample.destination,
                message: Sample.message,
            });
        });

        it('should throw an error when message is invalid', () => {
            const fn = () => push.send(123, Sample.destination);
            expect(fn).to.throw(Error).that.is.instanceOf(ConfigurationError)
                .and.have.property('message')
                .that.equals('missing message and/or destination');
        });

        it('should throw an error when destination is missing', () => {
            const fn = () => push.send(Sample.message);
            expect(fn).to.throw(Error).that.is.instanceOf(ConfigurationError)
                .and.have.property('message')
                .that.equals('missing message and/or destination');
        });
    });
});
