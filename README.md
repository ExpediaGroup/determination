# determination

Configuration resolver. `determination` loads a JSON configuration file, resolving against criteria using [confidence](https://github.com/hapijs/confidence) and [shortstop](https://github.com/krakenjs/shortstop) protocol handlers.

In addition, `determination` supports javascript style comments in your JSON using [shush](https://github.com/krakenjs/shush).

### Usage

```javascript
const Determination = require('determination');
```

**Determination.create(options)**

- `options` (_Object_) - an options object containing:
    - `config` (_String_) - required path to a JSON configuration.
    - `basedir` (_String_) - optional directory to use as base for `shortstop` protocols. Defaults to directory of `config` file.
    - `criteria` (_Object_) - optional resolution criteria. See [confidence](https://github.com/hapijs/confidence). Minimally will always contain `process.env` under the key `env`.
    - `protocols` (_Object_) - optional mapping of protocols for [shortstop](https://github.com/krakenjs/shortstop).
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
