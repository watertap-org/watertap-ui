const { app, BrowserWindow } = require('electron')
const path = require('path')
require('dotenv').config()

// let spawn = require("child_process").spawnSync

// const startServer = () => {
//     let backendProcess = spawn("uvicorn", 
//         [
//             "main:app",
//             "--host",
//             "127.0.0.1",
//             "--port",
//             process.env.API_PORT,
//             "--reload"
//         ],
//         {
//             cwd: 'backend',
//             stdio: 'pipe',
//             encoding: 'utf-8'
//         }
//     );

//     console.log(backendProcess.output);

//     // Works with require("child_process").spawnSync not .spawn
//     // backendProcess.stdout.pipe(process.stdout)
//     // backendProcess.stderr.pipe(process.stderr)

//     // backendProcess.stdout.on("data", (data) => {
//     //     // Handle data...
//     // })

//     // backendProcess.stderr.on("data", (err) => {
//     //     // Handle error...
//     // })

//     // backendProcess.on("exit", (code) => {
//     //     // Handle exit
//     // })
// }

// const startUI = () => {
//     let frontendProcess = spawn("npm", 
//         [
//             "start",
//         ],
//         {
//             cwd: 'ui',
//             env: {
//                 ...process.env,
//                 PORT: process.env.UI_PORT
//             },
//             stdio: 'pipe',
//             encoding: 'utf-8'
//         }
//     );

//     console.log(frontendProcess.output);

//     // Works with require("child_process").spawnSync not .spawn
//     // frontendProcess.stdout.pipe(process.stdout)
//     // frontendProcess.stderr.pipe(process.stderr)

//     // frontendProcess.stdout.on("data", (data) => {
//     //     // Handle data...
//     // })

//     // frontendProcess.stderr.on("data", (err) => {
//     //     // Handle error...
//     // })

//     // frontendProcess.on("exit", (code) => {
//     //     // Handle exit
//     // })
// }

const createWindow = () => {
    const win = new BrowserWindow({
        width: 2000,
        height: 1600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.webContents.openDevTools()
    const uiURL = `http://localhost:${process.env.UI_PORT}`
    win.loadURL(uiURL)
    console.log("UI URL:", uiURL)
}

app.whenReady().then(() => {
    // Entry point

    createWindow()
    

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// For windows & linux platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


