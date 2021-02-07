# SHARED-TOTP-APP

Sometimes you need to share login credentials with some people in your organisation,
and it would be quite good, to be able to use 2FA via [TOTP](https://en.wikipedia.org/wiki/Time-based_One-Time_Password) .
But you want a simple, usable solution, and you don't want to put a codegenerator app on everyones mobile phone.

This app solves this problem.

- tested on Ubunu 20.04

## Screenshots

![Create a new entry](https://github.com/fishat64/SHARED-TOTP-APP/blob/main/README/CreateEntry.png?raw=true)

![Get TOTP](https://github.com/fishat64/SHARED-TOTP-APP/blob/main/README/GetTOTPCode.png?raw=true)

![Remove/Delete entry](https://github.com/fishat64/SHARED-TOTP-APP/blob/main/README/RemoveEntry.png?raw=true)

## Getting started

### Requirements

- node
- npm
- git for cloneing

### starting for Development

`#bin/bash`

```
npm run installProject
npm run initProject
npm run startDev
```

Now, goto http://localhost:3000 for the frontend and
http://localhost:3001 for the backend.

### starting for Production

`#bin/bash`

```
npm run installProject
node config.js \
    --newconfig \
    --clientconfig \
    -overrideconfig \
    -port [YOUR PORT e.g. 5000] -debug false -baseURL [YOUR BASEURL e.g. http://localhost:5000/v1/] -minruntime 200 \
    -enableRemoveFE false -enableRemoveBE false \
    --deleteDBs
npm run buildFE
npm run startProd
```

## Available Scripts

In the project directory, you can run:

### `npm run initProject`

Generates one config.json in the root directory and one config.json in the client/src directory.

### `npm run installProject`

installs node_module in root and client directorys.

### `npm run startDev`

Starts for development.

### `npm run buildFE`

Builds FE Bundle.

### `npm run startProd`

Starts Project with builded FE-Bundle in `/client/build`.
To serve this directory "DEBUG" in `/config.json` must be set to `false`.

### `npm run cleanup`

Deletes `node_modules`, `package-lock.json`, `client/node_modules`, `client/package-lock.json`, `config.json`, `client/config.json` and removes the database in `server/db/*`.

### `npm run test`

See: TODO

## Testvalues

Can be genarted via:

```
LC_ALL=C tr -dc 'A-Z2-7' </dev/urandom | head -c 64; echo
```

Examples:

* M2K5BGKC7JI2Y43A5ATXBWSMU75Z5PTXZEUYEFMFLXNKSB5POTRDX4IIMPFEICIO
* BDVIDCNUHIIWUH44XZYJ2ETNYQ4LLARW6KGPI26ZTZEYTCRKQTREKKAW5T3KKHPB
* M54VSXN4RTWXCTEDAPGSCXGCJNVZUMHWPJ6PI7EHEYEO7WPRNVC64VEDES3UMQXL
* ZUEHX7GXWX44RU3M2GWF3IZWA4QZCPZEXWVW4SLTZHGBOK2R6LL3WPU4VSYC3RS5
* 7EAFM2GYFVOJMIIGPFOYN2V5MMTG3BDUIDAIL22HTELATKAYQRUBHBFY2ALYUETI

## TODO

- [ ] create Tests
- [ ] other languages: de, ...
- [ ] Password Policys

## Licence

MIT