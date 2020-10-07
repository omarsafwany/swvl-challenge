'use strict';

const expect = require('./Helpers/expect');

const PlatformsFactory = require('../src/PlatformsFactory');
const SMS = require('../src/Platforms/SMS');

describe('PlatformsFactory', () => {
    describe('create', () => {
        it('should create sms instance', () => {
            const sms = PlatformsFactory.create('SMS');
            expect(sms).to.be.instanceOf(SMS);
        });

        it('should throw an error when platform name is not a string', () => {
            const fn = () => PlatformsFactory.create();
            expect(fn).to.throw(Error).that.has.property('message')
                .that.equals('platform name should be a string');
        });

        it('should throw an error if platform is not supported', () => {
            const fn = () => PlatformsFactory.create('invalidPlatform');
            expect(fn).to.throw(Error).that.has.property('message')
                .that.equals('invalidPlatform is not supported');
        });
    });
});
