import { Menu, app } from "electron";

export function createMenu() {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: process.platform == 'darwin' ? undefined : 'App',
        type: 'submenu',
        submenu: [{
            label: 'Quit',
            click: app.quit,
        }],
    }]),);
}