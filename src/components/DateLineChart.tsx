import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Svg, Polyline, Line, Text as SVGText, Circle, G, Rect } from 'react-native-svg';
import { useEntriesStore } from '@/store/entriesStore';
import {
    format, eachDayOfInterval, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, isSameDay
} from 'date-fns';

interface DateLineChartProps {
    timePeriod: 'day' | 'week' | 'month';
}

// Helper function to format dates, handles week numbers
const formatDateLabel = (date: Date, timePeriod: 'day' | 'week' | 'month'): string => {
    if (timePeriod === 'day') return format(date, 'dd');
    if (timePeriod === 'week') return format(date, 'MM/dd'); // More compact week format
    return format(date, 'MMM');
};

const DateLineChart: React.FC<DateLineChartProps> = ({ timePeriod }) => {
    const { expenseList } = useEntriesStore();
    const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; total: number } | null>(null);

    const aggregatedData = expenseList.reduce<Record<string, number>>((acc, expense) => {
        const date = new Date(expense.date);
        let dateKey = '';
        if (timePeriod === 'day') dateKey = format(date, 'yyyy-MM-dd');
        else if (timePeriod === 'week') dateKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        else dateKey = format(date, 'yyyy-MM');

        acc[dateKey] = (acc[dateKey] || 0) + expense.total;
        return acc;
    }, {});

    const dates = expenseList.map(expense => new Date(expense.date));
    if (dates.length === 0) {
        return (<View style={styles.container}><Text>No expenses to display.</Text></View>);
    }
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const timeIntervals = getTimeIntervals(timePeriod, minDate, maxDate);
    const chartData = timeIntervals.map(date => ({
        date,
        total: aggregatedData[getDateKey(date, timePeriod)] || 0,
    }));

    const { width, height } = Dimensions.get('window');
    const chartWidth = width * 0.8;
    const chartHeight = height * 0.4;
    const maxTotal = Math.max(...chartData.map(item => item.total));
    const yRatio = (chartHeight - 60) / (maxTotal || 1);
    const xRatio = (chartWidth - 40) / (timeIntervals.length - 1 || 1);
    const padding = 20;

    // --- Calculate label skipping ---
    const labelSkip = calculateLabelSkip(timeIntervals.length, chartWidth);

    const points = chartData.map((dataPoint, index) => {
        const x = padding + index * xRatio;
        const y = chartHeight - 30 - dataPoint.total * yRatio;
        return `${x},${y}`;
    }).join(' ');

    const dataPoints = chartData.map((dataPoint, index) => {
        const x = padding + index * xRatio;
        const y = chartHeight - 30 - dataPoint.total * yRatio;
        return (
            <Circle
                key={index}
                cx={x}
                cy={y}
                r={4}
                fill="blue"
                onPress={() => showTooltip(x, y, dataPoint.date, dataPoint.total)}
            />
        );
    });

    const xAxisLabels = chartData.map((dataPoint, index) => {
        if (index % (labelSkip + 1) !== 0) {
            return null; // Skip this label
        }

        return (
            <SVGText
                key={index}
                x={padding + index * xRatio}
                y={chartHeight - 10}  // Adjusted y position
                fontSize="10"
                textAnchor="end" // Changed to end for rotated text
                fill="black"
                rotation={-45}   // Rotate labels by -45 degrees
                origin={`${padding + index * xRatio}, ${chartHeight - 10}`} // Set rotation origin
            >
                {formatDateLabel(dataPoint.date, timePeriod)}
            </SVGText>
        );
    });

    function getDateKey(date: Date, period: 'day' | 'week' | 'month'): string {
        if (period === 'day') return format(date, 'yyyy-MM-dd');
        if (period === 'week') return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        return format(date, 'yyyy-MM');
    }

    function getTimeIntervals(period: 'day' | 'week' | 'month', startDate: Date, endDate: Date): Date[] {
        if (period === 'day') return eachDayOfInterval({ start: startDate, end: endDate });
        if (period === 'week') {
            const weeks = eachWeekOfInterval(
                { start: startOfWeek(startDate, { weekStartsOn: 1 }), end: endOfWeek(endDate, { weekStartsOn: 1 }) },
                { weekStartsOn: 1 }
            );
            return weeks.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)));
        }
        return eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) });
    }

    function showTooltip(x: number, y: number, date: Date, total: number) {
        setTooltip({ x, y, date: format(date, 'yyyy-MM-dd'), total });
        setTimeout(() => setTooltip(null), 3000);
    }

    // --- Helper function to calculate label skipping ---
    function calculateLabelSkip(numLabels: number, chartWidth: number): number {
        const estimatedLabelWidth = 50; // Estimate label width (adjust as needed)
        const availableSpace = chartWidth - 40; // Account for padding
        const maxLabels = Math.floor(availableSpace / estimatedLabelWidth);

        if (numLabels <= maxLabels) {
            return 0; // No skipping needed
        }

        return Math.floor(numLabels / maxLabels); // Skip labels to fit
    }

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                {/* Axes */}
                <Line x1={padding} y1={chartHeight - 30} x2={chartWidth - padding} y2={chartHeight - 30} stroke="gray" />
                <Line x1={padding} y1={padding} x2={padding} y2={chartHeight - 30} stroke="gray" />

                {/* X-Axis Labels (Rotated) */}
                {xAxisLabels}

                {/* Y-Axis Labels */}
                <SVGText x={padding - 5} y={padding} fontSize="10" textAnchor="end" fill="black">{maxTotal.toFixed(0)}</SVGText>
                <SVGText x={padding - 5} y={chartHeight - 30} fontSize="10" textAnchor="end" fill="black">0</SVGText>

                {/* Data Line */}
                <Polyline points={points} fill="none" stroke="blue" strokeWidth="2" />

                {/* Data Points */}
                {dataPoints}

                {/* Tooltip */}
                {tooltip && (
                    <G>
                        <Rect x={tooltip.x - 30} y={tooltip.y - 45} width={60} height={30} fill="white" stroke="black" strokeWidth="1" rx={5} />
                        <SVGText x={tooltip.x} y={tooltip.y - 30} fontSize="10" textAnchor="middle" fill="black">{tooltip.date}</SVGText>
                        <SVGText x={tooltip.x} y={tooltip.y - 18} fontSize="10" textAnchor="middle" fill="black">${tooltip.total.toFixed(2)}</SVGText>
                    </G>
                )}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
});

export default DateLineChart;