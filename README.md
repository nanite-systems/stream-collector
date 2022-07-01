<div align="center">
<a href="https://nanite-systems.net/" target="blank">
  <img src="https://nanite-systems.net/images/ns.colored.svg" width="200" alt="Nest Logo" />
</a>

![version](https://img.shields.io/github/package-json/v/nanite-systems/stream-collector)
[![issues](https://img.shields.io/github/issues/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/issues)
[![dependecies](https://img.shields.io/librariesio/github/nanite-systems/stream-collector)](https://libraries.io/github/nanite-systems/stream-collector)
[![license](https://img.shields.io/github/license/nanite-systems/stream-collector)](https://github.com/nanite-systems/stream-collector/blob/main/LICENSE)

</div>

## Description

Collector service that pushes messages from the Census stream API to a RabbitMQ exchange. Used as part of the NS stream
API.

## Requirements

- NodeJS v16
- [Stream devkit](https://github.com/nanite-systems/stream-devkit/)

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

## Docker containers

As part of this project's releases, we build and ship a docker container for your use. To use this, please use the following image name:

```
ghcr.io/nanite-systems/stream-collector:<version>
```

e.g. to run this application with a `docker run` command, execute:

```bash
docker run \
-e "SERVICE_ID=example" \
-e "PS2_ENVIRONMENT=ps2" \
ghcr.io/nanite-systems/stream-collector
```

This will pull in the latest image and execute in your local docker runtime. You will need to supply a RabbitMQ server and inject that to the ENV `RABBIT_URL` for the service to fully work (see our [DevKit](https://github.com/nanite-systems/stream-devkit) to conveniently spin up an instance).

## License

All NS projects are [Apache-2.0 licensed](LICENSE).
