const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const log = require('electron-log');
const Store = require("electron-store")
const storage = new Store();
require('dotenv').config()

const axios = require('axios').default;
const isDev = require('electron-is-dev')
const { spawn } = require("child_process")

// Python server parameters
const PY_PORT = 8001;
const UI_PORT = 3000;
let uiReady = false

const serverURL = `http://localhost:${PY_PORT}`
const uiURL = `http://localhost:${UI_PORT}`

log.transports.file.resolvePath = () => path.join(__dirname, '/logsmain.log');
log.transports.file.level = "info";

exports.log = (entry) => log.info(entry)

require('@electron/remote/main').initialize()

// needs error handling?
function getWindowSettings () {
  const default_bounds = [800, 600]

  const size = storage.get('win-size');

  if (size) return size;
  else {
    storage.set("win-size", default_bounds);
    return default_bounds;
  }
}

function saveBounds (bounds) {
  storage.set("win-size", bounds)
}


function createWindow() {
  //get window size
  const bounds = getWindowSettings();
  console.log('bounds:',bounds)

  // Create the browser window.
  const win = new BrowserWindow({
    width: bounds[0],
    height: bounds[1],
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    }
  })
  if (isDev) {
    win.webContents.openDevTools()
  } 
  
  console.log("storing user preferences in: ",app.getPath('userData'));
  
  // save size of window when resized
  win.on("resized", () => saveBounds(win.getSize()));
  // win.on("moved", () => saveBounds(win.getSize()));

 
  win.loadURL(
    isDev
      ? uiURL
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

const installExtensions = () => {

  try{
    installationProcess = spawn(
      path.join(__dirname, "../py_dist/main/main"),
      [
        "install"
      ]
    );

  log.info("installation started");
  console.log("installation started");

    var scriptOutput = "";
    installationProcess.stdout.setEncoding('utf8');
    installationProcess.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        log.info('stdout: ' + data);
        data=data.toString();
        scriptOutput+=data;
    });

    installationProcess.stderr.setEncoding('utf8');
    installationProcess.stderr.on('data', function(data) {
        // console.log('stderr: ' + data);
        log.info('stderr: ' + data);
        data=data.toString();
        scriptOutput+=data;
    });
  } catch (error) {
    log.info("unable to get extensions: ",error);
    console.error("unable to get extensions: ",error);
  }
  return installationProcess;
}

const startServer = () => {
    if (isDev) {
      backendProcess = spawn("uvicorn", 
        [
            "main:app",
            "--host",
            "127.0.0.1",
            "--port",
            PY_PORT
        ],
        {
            cwd: '../backend/app'
        }
    );
      // log.info("Python process started in dev mode");
      // console.log("Python process started in dev mode");
    } else {
      try {
      backendProcess = spawn(
        path.join(__dirname, "../py_dist/main/main"),
        [
          ""
        ]
      );
      var scriptOutput = "";
        backendProcess.stdout.setEncoding('utf8');
        backendProcess.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
            log.info('stdout: ' + data);
            data=data.toString();
            scriptOutput+=data;
        });

        backendProcess.stderr.setEncoding('utf8');
        backendProcess.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            log.info('stderr: ' + data);
            data=data.toString();
            scriptOutput+=data;
        });
      log.info("Python process started in built mode");
      console.log("Python process started in built mode");
    } catch (error) {
      log.info("unable to start python process in build mode: ");
      log.info(error)
      console.error("unable to start python process in build mode: ");
      console.error(error)
    }
    }
    return backendProcess;
}
    


app.whenReady().then(() => {
    // Entry point
    if (isDev) {
      // log.info('starting electron app in dev mode')
      // console.log('starting electron app in dev mode')
      createWindow()
    } else {
      let win = createWindow();
      let serverProcess
      let installationProcess = installExtensions()
      installationProcess.on('exit', code => {
        log.info('installation exit code is', code)
        console.log('installation exit code is', code)
        log.info('starting server')
        console.log('starting server')
        serverProcess = startServer()

        let noTrails = 0
        
        // Start Window 
        var startUp = (url, appName, spawnedProcess, successFn=null, maxTrials=15) => {
            axios.get(url).then(() => {
                console.log(`${appName} is ready at ${url}!`)
                // if (successFn) {
                //     successFn()
                // }
            })
            .catch(async () => {
                console.log(`Waiting to be able to connect ${appName} at ${url}...`)
                log.info(`Waiting to be able to connect ${appName} at ${url}...`)
                await new Promise(resolve => setTimeout(resolve, 2000))
                noTrails += 1
                if (noTrails < maxTrials) {
                    startUp(url, appName, spawnedProcess, successFn, maxTrials)
                }
                else {
                    console.error(`Exceeded maximum trials to connect to ${appName}`)
                    log.error(`Exceeded maximum trials to connect to ${appName}`)
                    spawnedProcess.kill('SIGINT')
                }
            });
        };
        startUp(serverURL, 'FastAPI Server', serverProcess, createWindow)
        app.on('quit', () => {
          console.log('shutting down backend server')
          log.info('shutting down backend server')
          serverProcess.kill()
        })
      })
    }
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// For windows & linux platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


