'use strict';

const Co = require('co');
const Entries = require('entries');
const Shortstop = require('shortstop');
const Confidence = require('confidence');
const Hoek = require('hoek');
const Path = require('path');
const LoadJson = require('load-jsonic-sync');

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

const resolver = function ({ config, criteria, protocols, defaults, overrides }) {

    const basedir = Path.dirname(config);
    const configobject = LoadJson(config);

    if (typeof defaults === 'string') {
        defaults = LoadJson(defaults);
    }
    if (typeof overrides === 'string') {
        overrides = LoadJson(overrides);
    }

    criteria = Hoek.applyToDefaults(criteria, { env: process.env });

    return Co.wrap(function *() {

        const overriden = Hoek.applyToDefaults(configobject, overrides);

        const merged = Hoek.applyToDefaults(defaults, overriden);

        const resolvedCriteria = resolveCriteria(merged, criteria);

        const importsResolved = yield resolveProtocols(resolvedCriteria, {
            import(key) {
                return resolveCriteria(LoadJson(Path.resolve(Path.join(basedir, key))), criteria);
            }
        });

        const baseResolved = yield resolveProtocols(importsResolved, protocols);

        const configResolved = yield resolveProtocols(baseResolved, {
            config(key) {
                const keys = key.split('.');
                let result = this;

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
    });
};

module.exports = resolver;
