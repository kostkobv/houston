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
The project uses `mocha` and `chai` modules for testing. You can find test scripts inside of `test` folder along with mock files.

### Development mode
Houston is clustered for flexible development and separating into modules in future. For development `pm2` module is used. 
Check the `pm2-houston.json` file for more details.  