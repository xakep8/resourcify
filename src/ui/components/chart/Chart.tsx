import { useMemo } from 'preact/hooks';
import { RadialBarChart, RadialBar, PolarAngleAxis, PolarGrid } from 'recharts';

export type ChartProps = {
    data: number[];
    maxDataPoints: number;
    label?: string;
}

export function Chart(props: ChartProps) {
    const usageValue = useMemo(() => {
        return Math.round((props.data[0] || 0) * 100);
    }, [props.data]);

    // Format data for RadialBarChart
    const chartData = useMemo(() => {
        return [
            { name: 'Usage', value: usageValue }
        ];
    }, [usageValue]);

    return (
        <div className="flex justify-center items-center w-full">
            <RadialBarChart
                width={150}
                height={150}
                innerRadius={60}
                outerRadius={70}
                data={chartData}
                startAngle={90}
                endAngle={-270}
            >
                <PolarGrid radialLines={false} />
                <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                />
                <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                    fill="#2563eb"
                    backgroundFill="#4b5563"
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-300 text-xl font-bold"
                >
                    <tspan x="50%" y="45%" className="text-2xl font-bold">
                        {`${usageValue}%`}
                    </tspan>
                    {props.label && (
                        <tspan x="50%" y="65%" className="text-sm text-gray-400">
                            {props.label}
                        </tspan>
                    )}
                </text>
            </RadialBarChart>
        </div>
    );
}