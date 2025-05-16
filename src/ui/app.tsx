import { useState } from 'preact/hooks'
import './app.css';
import Container from './components/Container';
import Tabs from './components/Tabs';
import ResourceMonitor from './components/resourceMonitor';
import ProcessDisplay from './components/processMonitor';

export function App() {
  const [panel, setPanel] = useState("Resource");

  return (
    <Container>
      <div className="flex w-full h-max overflow-hidden">
        <div className="flex flex-col w-full justify-between">
          <Tabs setPanel={setPanel} />
          {panel === "Resource" && (
            <ResourceMonitor />
          )}
          {panel === "Processes" && (
            <ProcessDisplay />
          )}
        </div>
      </div>
    </Container>
  )
}
