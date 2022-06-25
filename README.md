# watertap-ui

This repository is for work on the user interface(s) (UI) for the WaterTAP library.

## Getting started (developer)

### Install Python

The Python code, and the PIP requirements, are in the `backend/` folder.

```
cd <watertap-ui-path>/backend
pip install -r requirements.txt
idaes get-extensions
```

### Install Javascript

Prerequisites: Node Package Manager (npm)

See the [NPM install page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for installation and the [NPM upgrade page](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) for upgrading to the latest version.
See the [NPM install page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for installation and the [NPM upgrade page](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) for upgrading to the latest version.

```console
cd <watertap-ui-path>/electron
npm install

cd <watertap-ui-path>/electron/ui
npm install
```

### Run UI

```console
cd <watertap-ui-path>/electron
npm start
```

## Windows instructions

The JS spawning doesn't work on Windows, so in order to start the app there you need to start things by hand using the following commands:

0. Turn off default browser opening with `$Env:Browser="none"`
1. From the repo root: `cd backend/app` and run `uvicorn main:app --host 127.0.0.1 --port 8000 --reload &`
2. Next `cd ../../electron/ui` and run `npm start &`. 
3. Finally: `cd ..` (now in 'electron' subdir) and run `npm start`
