import { useEffect, useState } from 'react';

export default function useGetProcess() {
    const [processes, setProcesses] = useState<ProcessInfo[]>([]);

    useEffect(() => {
        // Subscribe to process information updates
        const unsub = window.electron.subscribeProcessesInfo((processData: ProcessInfo[]) => {
            // Simply update with the latest process data
            setProcesses(processData);
        });
        
        // Clean up subscription when component unmounts
        return unsub;
    }, []);

    return processes;
}