'use strict';

const _ = require('lodash');

const{ ConfigurationError } = require('../Errors');

class Push {

    send(message, destination) {
        if(!_.isPlainObject(message) || _.isNil(destination)) {
            throw new ConfigurationError('missing message and/or destination');
        }

        const recipients = !_.isArray(destination) ? [destination] : destination;
        const promises = _.map(recipients, recipient => {
            return {
                to: recipient,
                message,
            };
        });

        return Promise.allSettled(promises);
    }

}

module.exports = Push;
