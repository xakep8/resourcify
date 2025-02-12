import { useMemo, useState } from 'preact/hooks'
import './app.css';
import { useStatistics } from './useStatistics';
import { Chart } from './Chart';

export function App() {
  const [panel, setPanel] = useState("CPU");
  const statistics = useStatistics(10);
  const cpuUsage = useMemo(() => statistics.map(stat => stat.cpuUsage), [statistics]);
  const ramUsage = useMemo(() => statistics.map(stat => stat.ramUsage), [statistics]);
  const diskUsage = useMemo(() => statistics.map(stat => stat.diskUsage), [statistics]);

  return (
    <div className="flex w-full h-screen overflow-y-hidden">
      <div className="flex flex-row w-full h-full justify-between">
        <div className="flex flex-col text-center items-center max-w-[25%] w-full h-full py-5 border-r-[0.5px] border-zinc-700">
          <button className="flex w-full text-center" onClick={() => setPanel("CPU")}>CPU Usage</button>
          <button className="flex w-full text-center" onClick={() => setPanel("RAM")}>RAM Usage</button>
          <button className="flex w-full text-center" onClick={() => setPanel("Disk")}>Disk Usage</button>
        </div>
        <div className="flex flex-col items-center w-full h-full overflow-y-scroll px-3 py-5">
          <div className={`flex-col w-full h-full justify-center items-center ${panel == "CPU" ? "flex" : "hidden"}`}>
            <span>CPU Usage:</span>
            <div className="h-[200px] w-full">
              <Chart data={cpuUsage} maxDataPoints={10} />
            </div>
          </div>
          <div className={`flex-col w-full h-full justify-center items-center ${panel == "RAM" ? "flex" : "hidden"}`}>
            <span>RAM Usage:</span>
            <div className="h-[200px] w-full">
              <Chart data={ramUsage} maxDataPoints={10} />
            </div>
          </div>
          <div className={`flex-col w-full h-full justify-center items-center ${panel == "Disk" ? "flex" : "hidden"}`}>
            <span>Disk Usage:</span>
            <div className="h-[200px] w-full">
              <Chart data={diskUsage} maxDataPoints={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
