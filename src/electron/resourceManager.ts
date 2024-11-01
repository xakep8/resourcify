import osUtils, { cpuUsage } from 'os-utils';
import fs from "fs";
import os from 'os';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const cpuUsage = await getCpuUsagage();
        const ramUsage = getRamUsage();
        const diskUsage = getDiskUsage().usage;
        ipcWebContentsSend("statistics", mainWindow.webContents, { cpuUsage, ramUsage, diskUsage });
    }, POLLING_INTERVAL);
}

export function getStaticData() {
    const totalStorage = getDiskUsage().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemGB = Math.floor(osUtils.totalmem() / 1024);
    return ({ totalStorage, cpuModel, totalMemGB });
}

function getCpuUsagage(): Promise<number> {
    return new Promise((resolve) => {
        osUtils.cpuUsage(resolve);
    });
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage();
}

function getDiskUsage() {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free / total,
    };
}