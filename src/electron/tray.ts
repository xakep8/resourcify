import { BrowserWindow, Menu, app } from "electron";
import { getAssestPath } from "./pathResolver.js";
import { Tray } from "electron";
import path from "path";


export function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(path.join(getAssestPath(), process.platform == 'darwin' ? 'faviconTemplate.png' : 'favicon.png'));
    const contextMenu=Menu.buildFromTemplate([
        {
            label: 'Show',
            click: ()=> {
                mainWindow.show();
                if(app.dock){
                    app.dock.show();
                }
            }
        }, {
            label: 'Quit',
            click: () => app.quit(),
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Resource Monitor');
    // tray.on('click', () => {
    //     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    //     if (app.dock) {
    //         app.dock.hide();
    //     }
    // });
}