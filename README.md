# ts-packager
A no-configuration necessary CLI for typescript package owners that generates corresponding builds for Common JS and ES Modules. Fire up the CLI and ship your code sanely!

### Installation
```bash
npm i -D @figliolia/ts-packager && npm link
yarn add -D @figliolia/ts-packager && npm link
```

### Background
For several years the migration to ES Modules has been a large pain point for package maintainers. This package is designed to take care of the interoperability by allowing you to distribute your build for both Common JS and ESM. 

The CLI will read from your project's TS Config, then override the appropriate options at build time to generate each build. It'll also take care of modifying your package.json file to appropriately distribute these builds.

Let's no longer distribute packages that break the projects of our peers!

### Basic Usage
To list options, run
```bash
npx ts-packager --help
```
#### Building for ES Modules and Common JS

```bash
npx ts-packager --command build-all --project <your project directory> -entrypoint <your includes directory>
```
By default, the `--project` and `--entrypoint` flag will be set to the current working directory

#### Building for ES Modules

```bash
npx ts-packager --command build-esm
```

#### Building for Common JS

```bash
npx ts-packager --command build-common
```

#### To Modify your package.json for distributing each build

```bash
npx ts-packager --command fix-package-file
```
When executing `--command build-all` your package file will automatically be modified to appropriately distribute your builds

