'use strict';

const Test = require('tape');
const Determination = require('../lib/index');
const Store = require('../lib/store');
const Path = require('path');
const Co = require('co');

Test('test determination', (t) => {

    t.test('resolve', Co.wrap(function *(t) {
        t.plan(2);

        const criteria = {
            pass: 'false'
        };

        try {
            const config = yield Determination.create({ config: Path.join(__dirname, './fixtures/a.json'), criteria }).resolve();

            t.equal(config.get('test.value'), false, 'criteria resolved.');
            t.equal(config.get('copy.value'), false, 'config resolved.');
        }
        catch (error) {
            console.log(error);
        }

    }));

    t.test('resolve do not pass criteria', Co.wrap(function *(t) {
        t.plan(1);

        try {
            const config = yield Determination.create({ config: Path.join(__dirname, './fixtures/a.json') }).resolve();

            t.equal(config.get('test.value'), true, 'no criteria resolved.');
        }
        catch (error) {
            console.log(error);
        }

    }));

    t.test('resolve with callback', (t) => {
        t.plan(1);

        Determination.create({ config: Path.join(__dirname, './fixtures/a.json') }).resolve((error) => {
            t.error(error, 'no error.');
        });
    });

    t.test('resolve do not pass criteria', Co.wrap(function *(t) {
        t.plan(2);

        const protocols = {
            error(value) {
                t.pass('error protocol called.');
                throw new Error(value);
            }
        };

        try {
            yield Determination.create({ config: Path.join(__dirname, './fixtures/b.json'), protocols }).resolve();
        }
        catch (error) {
            t.ok(error, 'received error');
        }

    }));

    t.test('resolve with error callback', (t) => {
        t.plan(2);

        const protocols = {
            error(value) {
                t.pass('error protocol called.');
                throw new Error(value);
            }
        };

        Determination.create({ config: Path.join(__dirname, './fixtures/b.json'), protocols }).resolve((error) => {
            t.ok(error, 'error.');
        });
    });

    t.test('resolve bad config path', Co.wrap(function *(t) {
        t.plan(1);

        try {
            const config = yield Determination.create({ config: Path.join(__dirname, './fixtures/b.json') }).resolve();

            t.equal(config.get('copy'), undefined, 'config protocol returned undefined for non-existent key.');
        }
        catch (error) {
            console.log(error);
        }

    }));

});

Test('test store', (t) => {
    t.plan(6);

    const store = new Store({
        key: 'value',
        deep: {
            key: 'value'
        }
    });

    t.equal(store._data.key, 'value', 'store data exists.');
    t.equal(store.get('key'), 'value', 'getter works');
    t.equal(store.get('deep.key'), 'value', 'get deep works');

    store.set('key', 'new value');
    store.set('deep.key', 'new value');

    t.equal(store.get('key'), 'new value', 'set works');
    t.equal(store.get('deep.key'), 'new value', 'deep set works.');

    store.merge({
        deep: {
            deeper: {
                key: 'value'
            }
        }
    });

    t.equal(store.get('deep.deeper.key'), 'value', 'merge works.');
});
