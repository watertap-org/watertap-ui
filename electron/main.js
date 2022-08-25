const { app, BrowserWindow } = require('electron')
const path = require('path')
const Store = require("electron-store")
const storage = new Store();
require('dotenv').config()

const axios = require('axios').default;
const isDev = require('electron-is-dev')
const { spawn, execFile } = require("child_process")

// Python server parameters
const PY_HOST = "127.0.0.1";
const PY_PORT = 8001;
const UI_PORT = 3000;
const PY_LOG_LEVEL = "info";
let uiReady = false

const serverURL = `http://localhost:${PY_PORT}`
const uiURL = `http://localhost:${UI_PORT}`

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
      enableRemoteModule: true
    }
  })

  console.log("storing user preferences in: ",app.getPath('userData'));
  
  // save size of window when resized
  win.on("resized", () => saveBounds(win.getSize()));
  // win.on("moved", () => saveBounds(win.getSize()));

  win.webContents.openDevTools()
  win.loadURL(
    isDev
      ? uiURL
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
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
      console.log("Python process started in dev mode");
    } else {
      backendProcess = execFile(
        path.join(__dirname, "../../py_dist/run_server/run_server"),
        [
          "--host",
          PY_HOST,
          "--port",
          PY_PORT,
          "--log-level",
          PY_LOG_LEVEL,
        ]
      );
      console.log("Python process started in built mode");
    }
    return backendProcess;
}
    


app.whenReady().then(() => {
    // Entry point

    let serverProcess = startServer()

    let noTrails = 0
    
    // Start Window 
    var startUp = (url, appName, spawnedProcess, successFn=null, maxTrials=15) => {
        
        axios.get(url).then(() => {
            console.log(`${appName} is ready at ${url}!`)
            if (successFn) {
                successFn()
            }
        })
        .catch(async () => {
            console.log(`Waiting to be able to connect ${appName} at ${url}...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
            noTrails += 1
            if (noTrails < maxTrials) {
                startUp(url, appName, spawnedProcess, successFn, maxTrials)
            }
            else {
                console.error(`Exceeded maximum trials to connect to ${appName}`)
                spawnedProcess.kill('SIGINT')
            }
        });
    };
    startUp(serverURL, 'FastAPI Server', serverProcess, createWindow)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// For windows & linux platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


