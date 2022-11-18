## [6.1.1](https://github.com/expediagroup/determination/compare/v6.1.0...v6.1.1) (2022-11-18)


### Bug Fixes

* bump minimatch from 3.0.4 to 3.1.2 ([#12](https://github.com/expediagroup/determination/issues/12)) ([0f60281](https://github.com/expediagroup/determination/commit/0f6028145a5ac14fa643b16788c7b4eb7e551d62))

# [6.1.0](https://github.com/expediagroup/determination/compare/v6.0.1...v6.1.0) (2022-02-09)


### Features

* Allows for configuration as an object ([#10](https://github.com/expediagroup/determination/issues/10)) ([a864038](https://github.com/expediagroup/determination/commit/a864038ab44063a7b0d6b38e43147b1d26f53b71))

### 6.0.1

- Change the json w/comments parser to eliminate a circular dependency warning with node 14 (#8)

### 6.0.0

- [Breaking] Drop support for node < 14.
- Update Github test workflow to only test againt node v 14.x
- Update dependencies, npm, and engines in package.json to support node version >= 14.

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
