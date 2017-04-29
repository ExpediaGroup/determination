'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const Resolver = require('./resolver');
const Store = require('./store');

const schema = Joi.object({
    config: Joi.string().required(),
    criteria: Joi.object().default({}),
    protocols: Joi.object().default({}),
    defaults: Joi.object().default({}),
    overrides: Joi.object().default({})
}).required();

const create = function (options) {
    const validation = Joi.validate(options, schema);

    Hoek.assert(!validation.error, validation.error);

    const resolver = Resolver(validation.value);

    const determination = {
        resolve(callback) {
            if (callback === undefined) {
                return new Promise((resolve, reject) => {
                    determination.resolve((error, resolved) => {
                        error ? reject(error) : resolve(resolved);
                    });
                });
            }
            resolver().then((resolved) => callback(null, new Store(resolved))).catch(callback);
        }
    };

    return determination;
};

module.exports = { create };
