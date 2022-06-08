/**
 * We initiate the React application and the FastAPI server in the preload
 * script before let electron start any window. After the initiation, electron
 * will have the window load the React localhost url.
 */
console.log("1. Running preload.js script")
require('dotenv').config()
let spawn = require("child_process").spawn

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
            cwd: 'backend'
        }
    );

    backendProcess.stdout.pipe(process.stdout);
    backendProcess.stderr.pipe(process.stderr);

    backendProcess.on("spawn", (data) => {
        // Handle data...
        console.log("backend ready!")
    });

    backendProcess.stdout.on("data", (data) => {
        // Handle data...
        console.log("backend data:")
        console.log(String.fromCharCode(...data))
    });

    backendProcess.stderr.on("data", (err) => {
        // Handle error...
    });

    backendProcess.on("exit", (code) => {
        // Handle exit
    });
}

const startUI = () => {
    let frontendProcess = spawn("npm", 
        [
            "start",
        ],
        {
            cwd: 'ui',
            env: {
                ...process.env,
                PORT: process.env.UI_PORT
            }
        }
    );

    frontendProcess.stdout.pipe(process.stdout);
    frontendProcess.stderr.pipe(process.stderr);

    frontendProcess.on("spawn", (data) => {
        // Handle data...
        console.log("frontend ready!")
    });

    frontendProcess.stdout.on("data", (data) => {
        // Handle data...
        console.log("frontend data:")
        console.log(String.fromCharCode(...data))
    });

    frontendProcess.stderr.on("data", (err) => {
        // Handle error...
    });

    frontendProcess.on("exit", (code) => {
        // Handle exit
    });
}

console.log("2. Running preload.js script")

// Start the Backend FastAPI server first
startServer();
// Start the Frontend React app
startUI();
