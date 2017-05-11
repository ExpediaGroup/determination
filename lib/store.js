'use strict';

const Props = require('dot-prop');
const Hoek = require('hoek');

class Store {
    constructor(config) {
        this._data = config;
    }

    merge(config) {
        this._data = Hoek.applyToDefaults(this._data, config);
    }

    use(store) {
        this.merge(store._data);
    }

    get(key) {
        return Props.get(this._data, key);
    }

    set(key, value) {
        Props.set(this._data, key, value);
    }
}

module.exports = Store;
