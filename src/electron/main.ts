import { app, BrowserWindow, Tray } from 'electron';
import { ipcHandle, isDev } from './util.js';
import { getStaticData, pollResources, pollProcessesInfo } from './resourceManager.js';
import { getPreloadPath } from './pathResolver.js';
import { getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            sandbox: false,
            nodeIntegration: true,
            contextIsolation: true,
        },
        width:500,
        height: 500,
        transparent: true,
        frame: false,
        resizable: false,
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123/");
    }
    else {
        mainWindow.loadFile(getUIPath());
    }
    pollResources(mainWindow);
    pollProcessesInfo(mainWindow);

    ipcHandle("getStaticData", () => {
        return getStaticData();
    })
    mainWindow.webContents.openDevTools();

    createTray(mainWindow);

    handleWindowClose(mainWindow);
    createMenu();
});

function handleWindowClose(mainWindow: BrowserWindow) {
    let willClose = false;

    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault();
        mainWindow.hide();
        if (app.dock) {
            app.dock.hide();
        }
    });

    app.on('before-quit', () => willClose = true);


    mainWindow.on('show', () => {
        willClose = false;
    });
}