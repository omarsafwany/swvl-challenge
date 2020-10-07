'use strict';

const _ = require('lodash');
const{ RateLimiter } = require('limiter');

const{ SchemaValidator } = require('./Services');
const NotificationSchema = require('./Schemas').Notification;
const SUPPORTED_PLATFORMS = Object.keys(require('./Platforms'));
const PlatformsFactory = require('./PlatformsFactory');

const LIMITS_PER_MINUTE = {
    email: 1,
    sms: 3,
    push: 4,
};

class Notifier {

    constructor() {
        this.schemaValidator = new SchemaValidator(NotificationSchema);

        _.forEach(SUPPORTED_PLATFORMS, platform => {
            this[`${platform.toLowerCase()}Platform`] = null;
            this[`${platform.toLowerCase()}Limiter`] = new RateLimiter(
                LIMITS_PER_MINUTE[platform.toLowerCase()], 'minute',
            );
        });
    }

    async send(request) {
        try {
            await this.schemaValidator.validate(request);
            const platformName = request.platform.toLowerCase();
            const platformInstance = this._getPlatform(request.platform);

            if(this[`${platformName}Limiter`].tryRemoveTokens(1)) {
                const response = await platformInstance.send(request.message, request.destination);
                const success = _.filter(response, item => item.status === 'fulfilled');
                const failure = _.filter(response, item => item.status === 'rejected');

                return {
                    details: `${request.platform} notifications have been sent successfully`,
                    success: success.length,
                    failure: failure.length,
                };
            }

            return {
                details: 'Limit has been reach. Please try again later.',
            };
        } catch(error) {
            throw error;
        }
    }

    _getPlatform(platform) {
        if(_.isNil(this[`${platform.toLowerCase()}Platform`])) {
            this[`${platform.toLowerCase()}Platform`] = PlatformsFactory.create(platform);
        }

        return this[`${platform.toLowerCase()}Platform`];
    }

}

module.exports = Notifier;
