'use strict';

const SUPPORTED_PLATFORMS = require('../Platforms');

module.exports = {
    $id: '/schema/swvl/notification',
    title: 'Swvl notification request schema',

    type: 'object',
    required: ['platform', 'destination', 'message'],
    additionalProperties: false,

    properties: {
        platform: {
            enum: Object.keys(SUPPORTED_PLATFORMS),
        },

        destination: {
            $ref: '#/definitions/recipients',
        },

        message: {
            type: 'object',
            required: ['content'],
            additionalProperties: false,

            properties: {
                content: {
                    type: 'object',
                    required: ['text'],
                    additionalProperties: false,

                    properties: {
                        subject: {
                            $ref: '#/definitions/non_empty_string',
                        },

                        text: {
                            $ref: '#/definitions/non_empty_string',
                        },
                    },
                },
            },
        },
    },

    switch: [
        {
            if: {
                properties: {
                    platform: {
                        enum: ['Email', 'Push'],
                    },
                },
            },

            then: {
                properties: {
                    message: {
                        properties: {
                            content: {
                                required: ['subject'],
                            },
                        },
                    },
                },
            },
        },
    ],

    definitions: {
        collection: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
        },

        non_empty_string: {
            type: 'string',
            minLength: 1,
        },

        email: {
            type: 'string',
            format: 'email',
        },

        phone: {
            type: 'string',
            pattern: '^01[0|1|2|5]\\d{8}$',
        },

        email_collection: {
            allOf: [
                { $ref: '#/definitions/collection' },
                { items: { $ref: '#/definitions/email' } },
            ],
        },

        mobile_numbers_collection: {
            allOf: [
                { $ref: '#/definitions/collection' },
                { items: { $ref: '#/definitions/phone' } },
            ],
        },

        email_recipients: {
            oneOf: [
                { $ref: '#/definitions/email_collection' },
                { $ref: '#/definitions/email' },
            ],
        },

        mobile_numbers_recipients: {
            oneOf: [
                { $ref: '#/definitions/mobile_numbers_collection' },
                { $ref: '#/definitions/phone' },
            ],
        },

        recipients: {
            oneOf: [
                { $ref: '#/definitions/email_recipients' },
                { $ref: '#/definitions/mobile_numbers_recipients' },
            ],
        },
    },
};
