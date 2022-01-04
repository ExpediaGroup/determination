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

const Entries = require('entries');
const Shortstop = require('shortstop');
const Confidence = require('@hapipal/confidence');
const Hoek = require('@hapi/hoek');
const Path = require('path');
const { parse } = require('comment-json');
const Fs = require('fs');


const resolveCriteria = function (config, criteria) {
    const store = new Confidence.Store(config);
    return store.get('/', criteria);
};

const resolveProtocols = function (config, protocols) {
    const shortstop = Shortstop.create();

    for (const [key, value] of Entries(protocols)) {
        shortstop.use(key, value.bind(config));
    }

    return new Promise((resolve, reject) => {
        shortstop.resolve(config, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
};

const loadAndParseJson = function (file) {
    try {
        return parse(Fs.readFileSync(file).toString());
    }
    catch (e) {
        e.message = `${e.message} \n  File: ${file}`;
        throw new Error(e);
    }
};

const resolver = async function ({ config, criteria, protocols, defaults, overrides }) {

    const basedir = Path.dirname(config);
    const configobject = loadAndParseJson(config);

    if (typeof defaults === 'string') {
        defaults = loadAndParseJson(defaults);
    }
    if (typeof overrides === 'string') {
        overrides = loadAndParseJson(overrides);
    }

    criteria = Hoek.applyToDefaults(criteria, { env: process.env });

    const overriden = Hoek.applyToDefaults(configobject, overrides);

    const merged = Hoek.applyToDefaults(defaults, overriden);

    const resolvedCriteria = resolveCriteria(merged, criteria);

    const importsResolved = await resolveProtocols(resolvedCriteria, {
        import(key) {
            return resolveCriteria(loadAndParseJson(Path.resolve(Path.join(basedir, key))), criteria);
        }
    });

    const baseResolved = await resolveProtocols(importsResolved, protocols);

    const configResolved = await resolveProtocols(baseResolved, {
        config(key) {
            const keys = key.split('.');
            let result = this; //eslint-disable-line consistent-this

            while (result && keys.length) {
                const prop = keys.shift();

                if (!result.hasOwnProperty(prop)) {
                    return undefined;
                }

                result = result[prop];
            }

            return keys.length ? null : result;
        }
    });

    return configResolved;
};

module.exports = resolver;
