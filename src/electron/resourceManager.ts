import osUtils from 'os-utils';
import fs from "fs";
import os from 'os';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';
import si from 'systeminformation';

const POLLING_INTERVAL = 2000;

export function pollResources(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const cpuUsage = await getCpuUsagage();
        const ramUsage = getRamUsage();
        const diskUsage = getDiskUsage().usage;
        ipcWebContentsSend("statistics", mainWindow.webContents, { cpuUsage, ramUsage, diskUsage });
    }, POLLING_INTERVAL);
}

// Add this function to poll processes info at regular intervals
export function pollProcessesInfo(mainWindow: BrowserWindow, interval = 2000) {
    setInterval(async () => {
        const processes = await getProcessesInfo();
        ipcWebContentsSend("processesInfo", mainWindow.webContents, processes);
    }, interval);
}

export async function getProcessesInfo() {
    try {
        // Get detailed process information
        const processes = await si.processes();
        
        // Get processes sorted by CPU usage
        const processesWithResources = processes.list.map(process => ({
            pid: process.pid,
            name: process.name,
            command: process.command,
            cpuPercent: process.cpu,
            memPercent: process.mem,
            memRss: process.memRss,  // Resident Set Size (actual memory used)
            priority: process.priority,
            path: process.path,
            user: process.user
        })).sort((a, b) => b.cpuPercent - a.cpuPercent);
        
        return processesWithResources;
    } catch (error) {
        console.error('Error fetching process information:', error);
        return [];
    }
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