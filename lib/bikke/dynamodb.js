'use strict';

var AWS = require('aws-sdk');

/**
 * Retrieve DynamoDB instance
 *
 * @param {Object} options
 * @returns {DynamoDB}
 */
exports.getInstance = function (options) {
    // AWS Profile
    if (options.profile !== undefined) {
        AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: options.profile});
    }

    // AWS region
    var region = 'ap-northeast-1';
    if (options.region !== undefined) {
        region = options.region;
    }
    AWS.config.region = region;

    var db = new AWS.DynamoDB();
    return db;
};
