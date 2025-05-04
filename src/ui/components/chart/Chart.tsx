import { useMemo } from 'preact/hooks';
import { BaseChart } from './BaseChart';
import { PieChart, Pie, Tooltip } from 'recharts';

export type ChartProps = {
    data: number[];
    maxDataPoints: number;
}

export function Chart(props: ChartProps) {
    const preparedData = useMemo(() => {
        const points = props.data.map((point) => ({ value: point * 100 }));
        return [...points, ...Array.from({ length: props.maxDataPoints - points.length }).map(() => ({ value: undefined }))];
    }, [props.data, props.maxDataPoints]);

    return (
        <>
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={[
                        { name: 'Used', value: preparedData[preparedData.length - 1]?.value ?? 0 },
                        { name: 'Free', value: 100 - (preparedData[preparedData.length - 1]?.value ?? 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label

                />
                <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
            <BaseChart data={preparedData} />
            {/* <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={desktopData}
                    dataKey="desktop"
                    nameKey="month"
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    activeShape={({
                        outerRadius = 0,
                        ...props
                    }: PieSectorDataItem) => (
                        <g>
                            <Sector {...props} outerRadius={outerRadius + 10} />
                            <Sector
                                {...props}
                                outerRadius={outerRadius + 25}
                                innerRadius={outerRadius + 12}
                            />
                        </g>
                    )}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {desktopData[activeIndex].desktop.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Visitors
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart> */}
        </>
    );
}