export default function Tabs(props: { setPanel: (panel: string) => void }) {
    return (
        <div className="flex flex-row text-center items-center w-full shadow-md shadow-blue-700 hover:shadow-lg hover:shadow-blue-800 rounded-md duration-300 transition-all">
            <button className="flex w-full text-center justify-center" onClick={() => props.setPanel("Resource")}>Resource Monitor</button>
            <button className="flex w-full text-center justify-center" onClick={() => props.setPanel("Processes")}>Processes</button>
        </div>
    );
}