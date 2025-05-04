type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
}

type StaticData = {
    totalStorage: number;
    cpuModel: string;
    totalMemGB: number;
}

type ProcessInfo = {
    pid: number;
    name: string;
    command: string;
    cpuPercent: number;
    memPercent: number;
    memRss: number; // Resident Set Size (actual memory used)
    priority: number;
    path: string;
    user: string;
}

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<StaticData>;
        subscribeProcessesInfo: (callback: (processes: ProcessInfo[]) => void) => UnsubscribeFunction;
    }
}

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    processesInfo: ProcessInfo[];
}

type UnsubscribeFunction= () => void;