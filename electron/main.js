const { app, BrowserWindow } = require('electron')
const path = require('path')
require('dotenv').config()

const axios = require('axios').default;
let spawn = require("child_process").spawn

let uiReady = false
const serverURL = `http://localhost:${process.env.API_PORT}`
const uiURL = `http://localhost:${process.env.UI_PORT}`

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 2000,
        height: 1600,
        // webPreferences: {
        //     preload: path.join(__dirname, 'preload.js')
        // }
    })

    mainWindow.webContents.openDevTools()
    
    mainWindow.loadURL(uiURL)
    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
        }
    });

    return mainWindow
}

const startServer = () => {
    let backendProcess = spawn("uvicorn", 
        [
            "main:app",
            "--host",
            "127.0.0.1",
            "--port",
            process.env.API_PORT,
            "--reload"
        ],
        {
            cwd: '../backend/app'
        }
    );

    return backendProcess
}

const startUI = () => {
    let frontendProcess = spawn("npm", 
        [
            'run',
            "start-nob",
        ],
        {
            cwd: 'ui',
            env: {
                ...process.env,
                PORT: process.env.UI_PORT
            }
        }
    );

    return frontendProcess
}

app.whenReady().then(() => {
    // Entry point

    let serverProcess = startServer()
    let uiProcess = startUI()

    // Start Window 
    var startUp = (url, appName, spawnedProcess, successFn=null, maxTrials=50) => {
        let noTrails = 0
        axios.get(url).then(() => {
            console.log(`${appName} is ready at ${url}!`)
            if (successFn) {
                successFn()
            }
        })
        .catch(async () => {
            console.log(`Waiting to be able to connect ${appName} at ${url}...`)
            await new Promise(resolve => setTimeout(resolve, 1000))
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
    startUp(serverURL, 'FastAPI Server', serverProcess)
    startUp(uiURL, 'React App', uiProcess, createWindow)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// For windows & linux platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


