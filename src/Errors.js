'use strict';

class SwvlChallenegeError extends Error {

    constructor(message) {
        super(message);
        this.name = 'SwvlChallenegeError';
    }

}

class ConfigurationError extends SwvlChallenegeError {

    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }

}

module.exports = {
    ConfigurationError,
};
