import React, { useMemo } from 'react';
import { View, Text, Svg, SVGText, G } from '@/src/components/Themed';
import { StyleSheet, Dimensions } from 'react-native';
import { Path } from 'react-native-svg';
import { useEntriesStore } from '@/store/entriesStore';
import { isWithinInterval, parseISO, getMonth, getYear } from 'date-fns';

interface CategoryPieChartProps {
    startDate?: Date | null;
    endDate?: Date | null;
    selectedMonth?: string | null;
    selectedYear?: string | null;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ startDate, endDate, selectedMonth, selectedYear }) => {
    const expenseList = useEntriesStore().itemEntryList;

    const filteredExpenses = useMemo(() => {
        return Object.values(expenseList).filter(expense => {
            const expenseDate = parseISO(expense.date);

            if (startDate && endDate) {
                return isWithinInterval(expenseDate, { start: startDate, end: endDate });
            } else if (selectedMonth && selectedYear) {
                const expenseMonth = getMonth(expenseDate).toString();
                const expenseYear = getYear(expenseDate).toString();

                return (
                    expenseMonth === selectedMonth &&
                    expenseYear === selectedYear
                );
            } else {
                return true; // No filter, include all expenses
            }
        });
    }, [expenseList, startDate, endDate, selectedMonth, selectedYear]);

    // Calculate total expenses per category USING FILTERED EXPENSES
    const categoryTotals: Record<string, number> = useMemo(() => {
        const totals: Record<string, number> = {};
        filteredExpenses.forEach(expense => {
            totals[expense.category] = (totals[expense.category] || 0) + expense.total;
        });
        return totals;
    }, [filteredExpenses]);

    const totalExpenses = useMemo(() => {
        return Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    }, [categoryTotals]);


    const data = useMemo(() => {
        return Object.entries(categoryTotals).map(([category, total]) => ({
            category,
            total,
            percentage: (total / totalExpenses) * 100,
            color: getRandomColor(),
        })).sort((a, b) => b.total - a.total); // Sort data by total, descending (largest slice first)
    }, [categoryTotals, totalExpenses]);

    const { width } = Dimensions.get('window');
    const radius = width * 0.3; // Adjust size as needed
    const centerX = width / 2;
    const centerY = width * 0.4;  // Adjust vertical position as needed

    const slices = useMemo(() => {
        let startAngle = 0;

        return data.map((item, index) => {
            const { percentage, color, category, total } = item;
            const angle = (percentage / 100) * 360; // Calculate the angle in degrees
            const endAngle = startAngle + angle;

            const x1 = centerX + radius * Math.cos(-startAngle * Math.PI / 180);  // Negative angle
            const y1 = centerY + radius * Math.sin(-startAngle * Math.PI / 180);  // Negative angle
            const x2 = centerX + radius * Math.cos(-endAngle * Math.PI / 180);      // Negative angle
            const y2 = centerY + radius * Math.sin(-endAngle * Math.PI / 180);      // Negative angle

            const largeArcFlag = angle > 180 ? 1 : 0; // Use angle

            const pathData = [
                `M ${centerX},${centerY}`,
                `L ${x1},${y1}`,
                `A ${radius},${radius} 0 ${largeArcFlag},0 ${x2},${y2}`, // Sweep flag to 0
                'Z',
            ].join(' ');

            const labelAngle = startAngle + angle / 2;  //Corrected
            const labelX = centerX + (radius * 0.7) * Math.cos(-labelAngle * Math.PI / 180); //Position label, Negative angle
            const labelY = centerY + (radius * 0.7) * Math.sin(-labelAngle * Math.PI / 180); // Negative angle
            startAngle = endAngle;


            return (
                <G key={index}>
                    <Path
                        d={pathData}
                        fill={color}
                        stroke="white"
                        strokeWidth="1"
                        onPress={() => { alert(`$${total} spent on ${category}.`); }}
                    />

                    {percentage > 5 && (
                        <SVGText
                            x={labelX}
                            y={labelY}
                            fontSize="16"
                            fill="#111"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            strokeWidth={0.5}
                            stroke="#222"
                            lightColor='#000'
                            darkColor='#000'
                        >
                            {`${percentage.toFixed(1)}%`}
                        </SVGText>
                    )}
                </G>
            );
        });
    }, [data, centerX, centerY, radius]);  // Don't forget to add radius to the dependency array

    if (totalExpenses === 0) {
        return (
            <View style={styles.container}>
                <Text>No expenses to display.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* Pie Chart */}
            <Svg width={width} height={width * 0.8}>
                {slices}
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.category}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 20,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    legendColor: {
        width: 15,
        height: 15,
        marginRight: 5,
        borderRadius: 3,
    },
    legendText: {
        fontSize: 14,
    },
});

export default CategoryPieChart;