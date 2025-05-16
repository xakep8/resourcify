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

export function pollProcessesInfo(mainWindow: BrowserWindow, interval = 5000) {
    setInterval(async () => {
        const processes = await getProcessesInfo();
        ipcWebContentsSend("processesInfo", mainWindow.webContents, processes);
    }, interval);
}

export async function getProcessesInfo() {
    try {
        // Get detailed process information
        const processes = await si.processes();

        const processMap = new Map();
        const rootProcesses: ProcessInfo[] = [];

        // Get processes sorted by CPU usage
        processes.list.forEach((process) => {
            const processObj = {
                pid: process.pid,
                name: process.name,
                command: process.command,
                cpuPercent: process.cpus,
                memPercent: process.mem,
                memRss: process.memRss,  // Resident Set Size (actual memory used)
                priority: process.priority,
                path: process.path,
                user: process.user,
                ppid: process.parentPid,
                children: [],
                depth: 0
            }
            processMap.set(process.pid, processObj);
        });

        processMap.forEach(process => {
            if (process.ppid && processMap.has(process.ppid)) {
                const parentProcess = processMap.get(process.ppid);
                process.depth = parentProcess.depth + 1;
                parentProcess.children.push(process);
                if(parentProcess.children.length <= 1) {
                    parentProcess.children.push(process);
                }
                else{
                    rootProcesses.push(process);
                }
            }
            else {
                rootProcesses.push(process);
            }
        });
        rootProcesses.sort((a, b) => b.cpuPercent - a.cpuPercent);
        return rootProcesses;
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