// Electon Setup
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // optional
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
