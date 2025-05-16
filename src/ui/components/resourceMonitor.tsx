import { Chart } from './chart/Chart';
import { useStatistics } from '../useStatistics';
import { useMemo } from 'preact/hooks';

export default function ResourceMonitor() {
    const statistics = useStatistics(1);
    const cpuUsage = useMemo(() => statistics.map(stat => stat.cpuUsage), [statistics]);
    const ramUsage = useMemo(() => statistics.map(stat => stat.ramUsage), [statistics]);
    const diskUsage = useMemo(() => statistics.map(stat => stat.diskUsage), [statistics]);

    return (
        <div className="flex flex-row items-center w-full h-max overflow-y-hidden px-3 py-5">
            <div className={`flex-col w-full h-full justify-center items-center`}>
                <div className="flex h-[200px] w-full justify-center items-center">
                    <Chart data={cpuUsage} maxDataPoints={1} label='CPU Usage' />
                </div>
            </div>
            <div className={`flex-col w-full h-full justify-center items-center`}>
                <div className=" flex h-[200px] w-full justify-center items-center">
                    <Chart data={ramUsage} maxDataPoints={1} label='RAM Usage' />
                </div>
            </div>
            <div className={`flex-col w-full h-full justify-center items-center mb-5`}>
                <div className="flex h-[200px] w-full justify-center items-center">
                    <Chart data={diskUsage} maxDataPoints={1} label='Disk Usage' />
                </div>
            </div>
        </div>
    )
}