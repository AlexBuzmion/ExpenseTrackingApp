import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { View, Text, Dropdown } from '@/src/components/Themed';
import CategoryPieChart from '@/src/components/CategoryPieChart';
import { CrossPlatformDatePicker } from '@/src/components/CrossPlatformDatePicker';
import { endOfDay, startOfDay, getMonth, getYear, startOfYear } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/src/components/CustomButton';

export default function AnalyticsScreen() {
    const [startDate, setStartDate] = useState(startOfYear(new Date()));
    const [endDate, setEndDate] = useState(endOfDay(new Date()));
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [customDateRangeEnabled, setCustomDateRangeEnabled] = useState(false);
    const [monthDropdownEnabled, setEnableMonthDropdown] = useState(false);

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
        const startYear = currentYear - 10;
        const yearOptions = [];
        for (let year = currentYear; year >= startYear; year--) {
            yearOptions.push({ label: String(year), value: String(year) });
        }
        return yearOptions;
    }, []);

    const getKey = () => {
        if (customDateRangeEnabled) {
            return `custom-${startDate.toISOString()}-${endDate.toISOString()}`;
        } else if (selectedYear) {
            return selectedMonth ? `${selectedYear}-${selectedMonth}` : `${selectedYear}`;
        } else {
            return 'all';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Expense Analytics</Text>

                <View style={styles.filterContainer}>
                    
                        <TouchableOpacity style={styles.switchContainer} onPress={() => setCustomDateRangeEnabled(!customDateRangeEnabled)}>
                        <Text style={styles.switchLabel}>Custom Date Range:</Text>
                            <Ionicons name={customDateRangeEnabled ? 'radio-button-on' : 'radio-button-off'} size={20} color={ useColorScheme() === 'light' ? Colors.light.tint : "#fff"}></Ionicons>
                        </TouchableOpacity>

                    {!customDateRangeEnabled && (
                        <View style={styles.dateSelectContainer}>
                            <View style={styles.dateOption}>
                                <Text style={styles.dateLabel}>Year:</Text>
                                <View style={styles.dropdownContainer}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={years}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Year"
                                        value={selectedYear}
                                        onChange={(item) => {
                                            setSelectedYear(item.value);
                                            setEnableMonthDropdown(true);
                                          }}
                                    />
                                </View>
                            </View>

                            {monthDropdownEnabled && (
                                <View style={styles.dateOption}>
                                    <Text style={styles.dateLabel}>Month:</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
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
                                        <View>
                                            <CustomButton
                                                onPressFunc={() => setSelectedMonth('')}
                                                title="Clear"
                                                width={'auto'}
                                                height={40}
                                                textStyle={{ fontSize: 10, fontWeight: 'bold' }}
                                                buttonStyle={{ margin: 0 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {customDateRangeEnabled && (
                        <View style={styles.dateSelectContainer}>
                            <View style={styles.dateOption}>
                                <Text style={styles.dateLabel}>Start Date:</Text>
                                <CrossPlatformDatePicker
                                    value={startDate}
                                    onChange={(date) => setStartDate(startOfDay(date))}
                                />
                            </View>
                            <View  style={styles.dateOption}>
                                <Text style={styles.dateLabel}>End Date:</Text>
                                <CrossPlatformDatePicker
                                    value={endDate}
                                    onChange={(date) => setEndDate(endOfDay(date))}
                                />
                            </View>
                        </View>
                    )}
                </View>

                <CategoryPieChart
                    startDate={customDateRangeEnabled ? startDate : null}
                    endDate={customDateRangeEnabled ? endDate : null}
                    selectedMonth={!customDateRangeEnabled ? selectedMonth : null}
                    selectedYear={!customDateRangeEnabled ? selectedYear : null}
                    key={getKey()}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    filterContainer: {
        width: '95%',
        marginBottom: 20,
        padding: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 40,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateSelectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateOption: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderWidth: 1.5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 3,
        marginHorizontal: 5,
        // marginVertical: 5,
        justifyContent: 'center',
        height: Platform.OS === 'ios' ? 56 : 46,
    },
    dropdown: {
        paddingHorizontal: 10,
        fontSize: 14,
    },
    datePickerContainer: {
        marginBottom: 15,
    },
});