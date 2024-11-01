import { ResponsiveContainer, AreaChart, CartesianGrid, Area, XAxis, YAxis } from "recharts";

type BaseChartProps = {
    data: { value: number | undefined }[];
}

export function BaseChart(props: BaseChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={props.data}>
                <CartesianGrid stroke="#333" strokeDasharray="5 5" fill="#1C1C1C" />
                <XAxis stroke="transparent" height={0} />
                <YAxis domain={[0,100]} stroke="transparent" width={0} />
                <Area strokeWidth={3} fillOpacity={0.3} isAnimationActive={false} type="monotone" dataKey="value" stroke="#5DD4EE" fill="#0A4D5C" />
            </AreaChart>
        </ResponsiveContainer>
    );
}