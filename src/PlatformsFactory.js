'use strict';

const _ = require('lodash');

const{ ConfigurationError } = require('./Errors');

const SUPPORTED_PLATFORMS = require('./Platforms');

class PlatformsFactory {

    static create(platform, config = {}) {
        if(!_.isString(platform)) {
            throw new ConfigurationError('platform name should be a string');
        }

        if(-1 === Object.keys(SUPPORTED_PLATFORMS).indexOf(platform)) {
            throw new ConfigurationError(`${platform} is not supported`);
        }

        if(!_.isPlainObject(config)) {
            throw new ConfigurationError('invalid config type');
        }

        return new SUPPORTED_PLATFORMS[platform](config);
    }

}

module.exports = PlatformsFactory;
