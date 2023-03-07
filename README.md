# watertap-ui

This repository is for work on the user interface (UI) for the WaterTAP library.

## Getting started (developer)

### Prerequisites

The following steps assume that:

1. `conda` is already installed and configured
2. This repository (i.e. the WaterTAP UI repository, https://github.com/watertap-org/watertap-ui) has been cloned locally and the working directory is set to the root of the repository

## Installation

### 1. Creating the Conda environment

Run the following command to create and activate a new Conda environment named `watertap-ui-env`:

```sh
conda env create --file environment.yml && conda activate watertap-ui-env
```

This will install the correct runtime versions of both the backend (Python) and frontend (JavaScript/NodeJS/Electron) portions of the UI, as well as the backend (Python) dependencies.

### 2. Install the JavaScript dependencies

Run the following commands to install the JavaScript dependencies:

```sh
npm --prefix electron clean-install
```

```sh
npm --prefix electron/ui clean-install
```

### 3. Install the IDAES solver dependencies

```sh
idaes get-extensions --verbose
```

### 4. (Optional) Install the developer version of WaterTAP

By default, Step 1 above will install the `watertap` Python package from the current `main` branch of the watertap-org/watertap repository.

To use the WaterTAP UI with the development version of WaterTAP, run the following steps:

#### 4.0. (Optional) Clone the `watertap-org/watertap` repository locally

If you already have a local clone of the WaterTAP repository, you can skip this step.

Otherwise, run the following command to create a local clone of the WaterTAP repository in a directory of your choice, e.g. `/path/to/my/watertap`:

```sh
git clone https://github.com/watertap-org/ /path/to/my/watertap
```

#### 4.1. Ensure that the `watertap-ui-env` Conda environment is active

```sh
conda activate watertap-ui-env
```

#### 4.2. Uninstall the currently installed version of WaterTAP

```sh
pip uninstall --yes watertap
```

#### 4.3. Install the development version of WaterTAP

The following assumes that the `watertap-org/watertap` repository has been cloned to a directory named `/path/to/my/watertap`.

```sh
bash -c "cd /path/to/my/watertap && pip install -r requirements-dev.txt"
```

# Running the UI

### Ensure that the `watertap-ui-env` Conda environment is active and all dependencies are installed

```console
conda activate watertap-ui-env
```

### Run UI in browser

```console
cd <watertap-ui-path>/electron/ui
npm run app-start
```

### Run UI with electron

```console
cd <watertap-ui-path>/electron/ui
npm run electron-start
```

# Running developer tests

To run the Python tests, make sure you have the appropriate version of watertap in your conda env.  Then from the repository root directory run:

`pytest backend/tests`


# Building production Electron app

The following steps assume that:

1. `conda` is already installed and configured
2. The WaterTAP-UI package has been succesfully installed
3. Watertap is cloned and installed locally, required for transferring data files (png and yaml)

### 1. Create installer for idaes extensions (needs to be done one time locally)

To create the installer needed to download idaes-extensions, we need a different version of idaes-pse than the one required to run watertap. If the installer is already created, skip this step.  
  
#### 1.1. Ensure that the `watertap-ui-env` Conda environment is active

```sh
conda activate watertap-ui-env
```

#### 1.2. Transfer Entry points

```sh
cd <watertap-ui-path>/electron
npm --prefix electron run move-entrypoints
```
          
#### 1.3. Uninstall the currently installed version of idaes

```sh
pip uninstall --yes idaes-pse
```

#### 1.4. Install idaes version 1.13 

```sh
pip install idaes-pse==1.13
```

#### 1.5. Create executable distribution using pyinstaller

```console
npm run get-extensions-installer
```

#### 1.6. Uninstall idaes version 1.13

```sh
pip uninstall --yes idaes-pse
```

#### 1.7. Reinstall idaes version 2.0.0

```sh
pip install 'idaes-pse @ https://github.com/watertap-org/idaes-pse/archive/2.0.0.dev3.watertap.22.08.11.zip'
```

### 2. Create build distribution

### Windows:
#### Requirements: 
1) Windows operating system
2) The following environment variables must be set
    - CSC_LINK: "<path-to-valid-codesigning-certificate.p12>"
    - CSC_KEY_PASSWORD: "<codesign-account-password>"

#### Command:
```console
cd <watertap-ui-path>/electron
npm run dist:win
```

### Mac (requires Mac OS):
#### Requirements: 
1) Mac operationg system
2) Signed in to Apple developer account
3) A valid <u>Developer ID Application</u> certificate AND corresponding private key stored in keychain access

#### Command:

```console
cd <watertap-ui-path>/electron
npm run dist:mac
```