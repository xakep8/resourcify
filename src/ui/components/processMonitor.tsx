import useGetProcess from '../useGetProcess';
import { useState } from 'react';


const ProcessItem = ({ process, depth = 0 }: { process: ProcessInfo, depth?: number }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = process.children && process.children.length > 0;


    return (
        <div className="flex flex-col">
            <div
                className={`flex justify-between p-4 ${depth === 0 ? 'bg-gray-800' : 'bg-gray-700'} rounded shadow mb-1`}
                style={{ paddingLeft: `${depth * 20 + 16}px` }}
            >
                <div className="flex items-center">
                    {hasChildren && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mr-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white"
                        >
                            {expanded ? '−' : '+'}
                        </button>
                    )}
                    <span className="text-white font-medium">{process.name}</span>
                    {/* <span className="text-gray-400 ml-2">({process.pid})</span> */}
                </div>
                <div className="flex space-x-4">
                    <span className="text-gray-400">CPU: {process.cpuPercent.toFixed(2)}%</span>
                    <span className="text-gray-400">Memory: {process.memPercent.toFixed(2)}%</span>
                </div>
            </div>

            {expanded && hasChildren && (
                <div className="ml-2">
                    {process.children.map((child, i) => (
                        <ProcessItem key={i} process={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ProcessDisplay() {
    const processes = useGetProcess();

    return (
        <div className="flex w-[95vw] h-[84vh] flex-col space-y-4 mt-5 ml-2 overflow-y-scroll">
            {processes.map((process, index) => (
                <ProcessItem key={index} process={process} />
            ))}
        </div>
    );
}