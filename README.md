# Houston
### We have a problem here...

## Motivation
MobileBridge needs the "one place to rule them all" which can catch all the errors and to keep all the stats for projects.

## Description
The back-end part of Houston project. 
Tracks the data from rollbar, jira, (bitbucket) to show information on the big screen in the office.

## Usage

Just run the `node app` to see the list of available commands.

Available modules so far:
* rollbar

## Documentation

You can find the documentation inside of the `docs` folder. 

## Development 
First you need to have node.js installed. 
Check the needed version inside the `.nvmrc` file. 
Or you can just checkout that version with `nvm which` if you have the `nvm` installed.

Project is implemented with ES2015. Some of features which are not available in actual NodeJS version are marked with `TODO`.
 
Install all dependencies with
```
npm install
```

The project uses `package.json` for development actions.

### Available development actions

```
npm run test
```
Runs project tests.

```
npm run lint
```
To check if the code is appropriate to the styleguide.

```
npm run docs
```
Generates the project documentation. The output can be found in `docs` folder.

```
npm run development
```
To run the project in the development mode. 

### Testing 
The project uses `mocha` and `chai` libraries for testing. You can find test scripts inside of `test` folder along with mock files.

### Development mode
Houston is clustered for flexible development and easy separation functionality into modules in future. For development `pm2` library is used. 
Check the `pm2-houston.json` file for more details. 
 
#### Creating the new module

The new module should be placed into the `modules` folder. Check out the `test/mocks/modules/test` module 
as an example of the new module.

#### Configuring the module

The global configuration of the whole project (which is injected to the container of every module as `config`)
and the configurations of the module would be merged inside of module container. The approach for module configuration 
is the same as for the global one (main config which is merged with environment config file). 

Besides each module has the `libs.json` file in which required node modules which would be injected into the 
module container could be specified. If there is a need in having the different name for module inside the 
container the `path` value should be provided (i.e.: `name: 'redis', path: 'ioredis'`. The `ioredis`module would 
be injected as `redis`). If `path` is not provided the `name` value would be used instead. The `options` object 
can be provided for initializing the module with specific options (basically if the options value is provided, 
instead of injecting the `require(moduleName)` it will inject `require(moduleName)(options)`). The data from global 
configuration could be imported to keep the configs consistent with `${key:subkey:...}` template. If the key doesn't 
exist in the global config the injected value won't be changed. (check the example of `libs.json` 
file in `test/mocks/modules/test/config/`). 

Module folders should be specified in `libs.json` as value of `module` key for proper injection. Please try to
keep the modules simple and not to create nesting deeper then one level inside of module folders. The access 
to the module's elements would be based on file's name. That means that file `controllers/moduleController.js`
which exports some functionality (`module.exports = ...`) would be accessible through the whole module as 
`moduleController` in dependencies (`module.exports = function(moduleController) { ...`).