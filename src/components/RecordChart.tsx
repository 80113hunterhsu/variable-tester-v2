// node modules
import { useEffect, useState } from "react";
import {
    ComposedChart,
    Line,
    Brush,
    Tooltip,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts";

// helpers
import { generateElementKey } from "../helpers/Element";

// css
import "./RecordChart.css";

function processRecordToChartData(
    record: Record<string, { time: string; timeMS: string; score: number }>
) {
    return record
        ? Object.entries(record).map(([key, value]) => ({ ...value, key }))
        : [];
}

export default function RecordChart({
    record,
    isBidirectional,
    maxScore,
    updateRecord,
    isEditable = false,
    handlePointClick,
}: {
    record: Record<string, { time: string; timeMS: string; score: number }>;
    isBidirectional: boolean;
    maxScore: number;
    updateRecord?: (time: string, score: number) => void | undefined;
    isEditable?: boolean | undefined;
    handlePointClick?: (payload: any, key: string) => void | undefined;
}) {
    const [data, setData] = useState(processRecordToChartData(record));
    useEffect(() => {
        setData(processRecordToChartData(record));
    }, [record]);

    const minScore = isBidirectional ? -maxScore : 0;
    const isClickable: boolean =
        !!isEditable && !!updateRecord && !!handlePointClick;

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data}>
                    <Line
                        dataKey="score"
                        isAnimationActive={false}
                        dot={({ cx, cy, payload, index }) => (
                            <circle
                                key={generateElementKey(`dot-${payload.key}-${index}`)}
                                cx={cx}
                                cy={cy}
                                r={isClickable ? 10 : 5}
                                stroke="blue"
                                strokeWidth={2}
                                fill="white"
                                onClick={() => {
                                    if (!isClickable || !handlePointClick) return;
                                    handlePointClick(
                                        payload as {
                                            time: string;
                                            timeMS: string;
                                            score: number;
                                        },
                                        payload.key
                                    );
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    />
                    <XAxis
                        tickSize={30}
                        height={60}
                        interval={"equidistantPreserveStart"}
                        dataKey="timeMS"
                    />
                    <YAxis domain={[minScore, maxScore]} />
                    <CartesianGrid strokeDasharray="3 3" />
                    {isBidirectional && (
                        <ReferenceLine y={0} strokeWidth={2.5} strokeDasharray="0" />
                    )}
                    <Tooltip cursor={false} wrapperStyle={{ pointerEvents: "none" }} />
                    <Legend />
                    <Brush fill="#ccc" gap={1} travellerWidth={5}>
                        <ComposedChart data={data}>
                            <Line dataKey="score" isAnimationActive={false} />
                        </ComposedChart>
                    </Brush>
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
}
