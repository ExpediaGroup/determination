/**
 *
 * MIT License
 *
 * Copyright (c) 2019 Expedia, Inc
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
**/
'use strict';

const Joi = require('@hapi/joi');
const Hoek = require('@hapi/hoek');
const Resolver = require('./resolver');
const Store = require('./store');

const schema = Joi.object({
    config: Joi.string().required(),
    criteria: Joi.object().default({}),
    protocols: Joi.object().default({}),
    defaults: Joi.alternatives(Joi.string(), Joi.object()).default({}),
    overrides: Joi.alternatives(Joi.string(), Joi.object()).default({})
}).required();

const create = function (options) {
    const validation = schema.validate(options);

    Hoek.assert(!validation.error, validation.error);

    const determination = {
        resolve(callback) {
            if (callback === undefined) {
                return new Promise((resolve, reject) => {
                    determination.resolve((error, resolved) => {
                        error ? reject(error) : resolve(resolved);
                    });
                });
            }
            Resolver(validation.value).then((resolved) => callback(null, new Store(resolved))).catch(callback);
        }
    };

    return determination;
};

module.exports = { create };
