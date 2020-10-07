'use strict';

const _ = require('lodash');
const expect = require('./Helpers/expect');
const{ email, push, sms } = require('./Helpers/Samples');

const Notifier = require('../src/Notifier');

describe('Notifier', () => {
    let notifier;

    before(() => {
        notifier = new Notifier();
    });

    describe('constructor', () => {
        it('should create a Notifier instance', () =>
            expect(notifier).to.be.instanceOf(Notifier),
        );
    });

    describe('send', () => {
        it('should send an email notification', async() => {
            const response = await notifier.send(email);
            expect(response).to.deep.equal({
                details: 'Email notifications have been sent successfully',
                success: email.destination.length,
                failure: 0,
            });
        });

        it('should send a push notification', async() => {
            const response = await notifier.send(push);
            expect(response).to.deep.equal({
                details: 'Push notifications have been sent successfully',
                success: 1,
                failure: 0,
            });
        });

        it('should send a sms notification', async() => {
            const response = await notifier.send(sms);
            expect(response).to.deep.equal({
                details: 'SMS notifications have been sent successfully',
                success: sms.destination.length,
                failure: 0,
            });
        });

        it('should return validation errors', () => {
            const promise = notifier.send({});

            return expect(promise).to.be.eventually.rejectedWith(Error)
                .and.have.property('details').that.deep.equals([
                    {
                        dataPath: '',
                        keyword: 'required',
                        message: 'should have required property \'platform\'',
                        params: {
                            missingProperty: 'platform',
                        },
                    },
                    {
                        dataPath: '',
                        keyword: 'required',
                        message: 'should have required property \'destination\'',
                        params: {
                            missingProperty: 'destination',
                        },
                    },
                    {
                        dataPath: '',
                        keyword: 'required',
                        message: 'should have required property \'message\'',
                        params: {
                            missingProperty: 'message',
                        },
                    },
                ]);
        });

        it('should return rate limit', async() => {
            const clonedSample = _.cloneDeep(email);
            clonedSample.destination.push('testing@swvl.com');
            clonedSample.destination.push('engineering@swvl.com');

            const response = await notifier.send(clonedSample);
            expect(response).to.deep.equal({
                details: 'Limit has been reach. Please try again later.',
            });
        });
    });
});
