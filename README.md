# determination

Configuration resolver. `determination` loads a JSON configuration file, resolving against criteria using [confidence](https://github.com/hapijs/confidence) and [shortstop](https://github.com/krakenjs/shortstop) protocol handlers.

In addition, `determination` supports javascript style comments in your JSON using [shush](https://github.com/krakenjs/shush).

Note: `determination` borrows heavily from [confit](https://github.com/krakenjs/confit), but prefers `confidence` for resolving environment as well as other criteria for filtering.

### Usage

```javascript
const Determination = require('determination');
```

**Determination.create(options)**

- `options` (_Object_) - an options object containing:
    - `config` (_String_) - required path to a JSON configuration.
    - `criteria` (_Object_) - optional resolution criteria. See [confidence](https://github.com/hapijs/confidence). Minimally will always contain `process.env` under the key `env`.
    - `protocols` (_Object_) - optional mapping of protocols for [shortstop](https://github.com/krakenjs/shortstop).
    - `defaults` (_Object_) - optional default configuration values.
    - `overrides` (_Object_) - optional override configuration values.
- returns - a resolver.

**resolver.resolve([callback])**

- `callback` (_Function_) - an optional callback.
- returns - a promise if `callback` is not provided.

```javascript
const Determination = require('determination');
const Path = require('path');
const Handlers = require('shortstop-handlers');

const config = Path.join('.', 'config', 'config.json');

const resolver = Determination.create({
    config,
    protocols: {
        require: Handlers.require(Path.dirname(config))
    }
});

resolver.resolve((error, config) => {
    //config.get
    //config.set
});
```

### Config API

- `get(string: key)` - returns the value for the given `key`, where a dot-delimited `key` may traverse the configuration store.
- `set(string: key, any: value)` - sets the given `value` on the given `key`, where dot-delimited `key` may traverse the configuration store.
- `merge(object: value)` - merged the given `value` into the configuration store.

```javascript
config.set('some.key.name', 'value');
config.merge({ some: { key: other: 'another value' }});
config.get('some.key.other'); //'another value'
```

### Shortstop Protocol Handlers

Two protocol handlers are enabled by default:

- `import:path` - merges the contents of a given file, supporting comments (unlike `require`).
- `config:key` - copies the value under the given key (supporting dot-delimited) to the key it is declared on.

### Resolution Order

Configuration file contents are resolved in the following order:

1. Resolve `defaults` against `protocols`.
2. Merge `defaults` with `config`.
3. Resolve merged `config` against `protocols`.
4. Resolve `overrides` against `protocols`.
5. Merge `overrides` into `config`.
6. Resolve `config` against `config:` protocol.
