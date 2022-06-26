<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

![GitHub package.json version](https://img.shields.io/github/package-json/v/nanite-systems/stream-collector)
[![issues](https://img.shields.io/github/issues/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/issues)
[![dependecies](https://img.shields.io/librariesio/github/nanite-systems/stream-collector)](https://libraries.io/github/nanite-systems/stream-collector)
[![license](https://img.shields.io/github/license/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/blob/main/LICENSE)

</div>

## Description

Collector service that pushes messages from the Census stream API to a RabbitMQ exchange. Used as part of the NS stream
API.

## Requirements

- NodeJS v16
- [Stream devkit](https://github.com/nanite-systems/stream-devkit/)*

## Installation

```bash
# configuration
$ cp .env.example .env

# install dependencies
$ yarn install
```

## Running the service

```bash
# development
$ yarn start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

All NS projects are [Apache-2.0 licensed](LICENSE).
