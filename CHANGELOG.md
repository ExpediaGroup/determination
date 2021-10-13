### 5.0.0

- [Breaking] [confidence](https://github.com/hapipal/confidence), the library that parses the json config files has been updated from v3 to v6.


### 4.0.0

- [Breaking] Drop support for node < 12.
- Update Github test workflow to only test againt node v 12.x
- Update dependencies, npm, and engines in package.json to support node version >= 12.

### 3.0.1

- Bump dot-prop from 4.2.0 to 5.2.0 ([#4](https://github.com/ExpediaGroup/determination/pull/4))

### 3.0.0

- Updated license and copyright
- [BREAKING] Updated Node.js supported version

### 2.0.0

- Protocols are bound with context `config`.
- [BREAKING] `defaults` and `overrides` are merged prior to resolving criteria or handlers.

### 1.3.0

- `config.data` returns a clone of the underlying store data.

### 1.2.0

- `config.use` is now a thing.

### 1.1.0

- `overrides` and `defaults` can be a string referring to a file to load.
