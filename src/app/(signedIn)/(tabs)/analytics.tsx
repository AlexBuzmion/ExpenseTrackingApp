import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, Switch } from 'react-native';
import { View, Text, Dropdown } from '@/src/components/Themed';
import CategoryPieChart from '@/src/components/CategoryPieChart';
import { CrossPlatformDatePicker } from '@/src/components/CrossPlatformDatePicker';
import { endOfDay, startOfDay, getMonth, getYear } from 'date-fns';

export default function AnalyticsScreen() {
    const [startDate, setStartDate] = useState(startOfDay(new Date())); // Initial start date
    const [endDate, setEndDate] = useState(endOfDay(new Date()));     // Initial end date
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [customDateRangeEnabled, setCustomDateRangeEnabled] = useState(false);

    const months = useMemo(() => {
        return [
            { label: 'January', value: '0' }, // Month values start from 0
            { label: 'February', value: '1' },
            { label: 'March', value: '2' },
            { label: 'April', value: '3' },
            { label: 'May', value: '4' },
            { label: 'June', value: '5' },
            { label: 'July', value: '6' },
            { label: 'August', value: '7' },
            { label: 'September', value: '8' },
            { label: 'October', value: '9' },
            { label: 'November', value: '10' },
            { label: 'December', value: '11' },
        ];
    }, []);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 10;  // Show last 10 years
        const yearOptions = [];
        for (let year = currentYear; year >= startYear; year--) {
            yearOptions.push({ label: String(year), value: String(year) });
        }
        return yearOptions;
    }, []);

    // Function to calculate key for CategoryPieChart
    const getKey = () => {
        if (customDateRangeEnabled) {
            return `custom-${startDate.toISOString()}-${endDate.toISOString()}`;
        } else if (selectedMonth && selectedYear) {
            return `${selectedYear}-${selectedMonth}`;
        } else {
            return 'all';
        }
    };

    return (
        <View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Expense Analytics</Text>

                    <View style={styles.filterContainer}>
                        <Text style={styles.subtitle}>Filter by:</Text>

                        <View style={styles.switchContainer}>
                            <Text>Custom Date Range:</Text>
                            <Switch
                                value={customDateRangeEnabled}
                                onValueChange={setCustomDateRangeEnabled}
                            />
                        </View>

                        {!customDateRangeEnabled && (
                            <View style={{marginTop: 10, flexDirection: 'row'}}>
                                <View style={{flex: .5}}>
                                    <Text>Month:</Text>
                                    <View style={styles.dropdownContainer}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={months}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Month"
                                            value={selectedMonth}
                                            onChange={item => setSelectedMonth(item.value)}
                                        />
                                    </View>
                                </View>
                                <View style={{flex: .5}}>
                                    <Text>Year:</Text>
                                    <View style={styles.dropdownContainer}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={years}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Year"
                                            value={selectedYear}
                                            onChange={item => setSelectedYear(item.value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {customDateRangeEnabled && (
                            <View style={styles.datePickerContainer}>
                                <CrossPlatformDatePicker
                                    value={startDate}
                                    onChange={(date) => setStartDate(startOfDay(date))}
                                />
                                <CrossPlatformDatePicker
                                    value={endDate}
                                    onChange={(date) => setEndDate(endOfDay(date))} // Set to end of day
                                />
                            </View>
                        )}
                    </View>

                    <CategoryPieChart
                        startDate={customDateRangeEnabled ? startDate : null}
                        endDate={customDateRangeEnabled ? endDate : null}
                        selectedMonth={!customDateRangeEnabled ? selectedMonth : null}
                        selectedYear={!customDateRangeEnabled ? selectedYear : null}
                        key={getKey()} // Key prop for re-rendering
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Important for ScrollView to work correctly
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Start from the top
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    filterContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Or use 'space-between'
        width: '100%',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 10,
    },
    dropdownContainer: {
        marginHorizontal: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        justifyContent: 'center',
        padding: 5,
        height: 40,
        width: "auto",
    },
    dropdown: {
        height: '100%',
        width: '90%',
        paddingHorizontal: 10,
    },
});