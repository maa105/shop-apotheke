
## Github Rate Limit

Github has a very strict rate limit for unauthenticated calls to it's API (20 per day per ip). To get around that authenticated calls should be used.

To ensure your calls to the Github API are authenticated, you can [create a pesonal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) and paste it in `./frontend/src/setupProxy.js` line 4 `const gitHubToken='<your_token>';` P.S. You need to restart dev server (ctrl+c then `npm start`) for this to take effect.

## Installing Dependencies

run `npm i` on root and in `./frontend` folder

## Available Scripts

In the project root directory, you can run:

### `npm run startup`

installs dependencies and starts the react frontend.<br />
works on windows. otherwise install dependencies manually ([see above](#installing-dependencies)) then run `npm start`.<br />

### `npm start`

if dependencies are installed you can run this one directly

### `npm test`

runs the test cases and watches for changes

### `npm run build`

Builds the app for production.<br />
The build output will be in `./frontend/builds/production.zip`

### `gulp build:frontend --env <production|staging|development> [--zip] [--keep]`

Builds the app for the specified environment.<br />
specify --zip to zip the build.<br />
specify --keep in case --zip is specified to keep the original folder.<br />

## Configs

check `./frontend/src/config` for different configuration files. (apiPrefix is very important)

## In Development

check `./frontend/src/setupProxy.js` for proxy configuration to your backend. also check [Github Rate Limit](#github-rate-limit) with regards to this file.
