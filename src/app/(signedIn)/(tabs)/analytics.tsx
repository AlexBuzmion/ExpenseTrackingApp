import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import CategoryPieChart from '@/src/components/CategoryPieChart';
import { CrossPlatformDatePicker } from '@/src/components/CrossPlatformDatePicker';
import { endOfDay, startOfDay } from 'date-fns';

export default function AnalyticsScreen() {
    const [startDate, setStartDate] = useState(startOfDay(new Date())); // Initial start date
    const [endDate, setEndDate] = useState(endOfDay(new Date()));     // Initial end date

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Expense Analytics</Text>

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

                <CategoryPieChart startDate={startDate} endDate={endDate} />
            </View>
        </ScrollView>
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
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Or use 'space-between'
        width: '100%',
        marginBottom: 20,
    },
});