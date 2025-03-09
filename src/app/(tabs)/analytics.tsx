import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { View, Text } from '@/src/components/Themed';
import CategoryPieChart from '@/src/components/CategoryPieChart';
import DateLineChart from '@/src/components/DateLineChart';
import Colors from '@/src/constants/Colors';

export default function AnalyticsScreen() {
    const [viewMode, setViewMode] = useState<'pie' | 'line'>('pie'); // State for view mode
    const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month'); // State for time period

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Expense Analytics</Text>

                {/* View Mode Selector */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, viewMode === 'pie' && styles.activeButton]}
                        onPress={() => setViewMode('pie')}
                    >
                        <Text style={[styles.buttonText, viewMode === 'pie' && styles.activeButtonText]}>Pie Chart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, viewMode === 'line' && styles.activeButton]}
                        onPress={() => setViewMode('line')}
                    >
                        <Text style={[styles.buttonText, viewMode === 'line' && styles.activeButtonText]}>Line Chart</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Time Period Selector (only shown for line chart) */}
                {viewMode === 'line' && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, timePeriod === 'day' && styles.activeButton]}
                            onPress={() => setTimePeriod('day')}
                        >
                            <Text style={[styles.buttonText, timePeriod === 'day' && styles.activeButtonText]}>Day</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, timePeriod === 'week' && styles.activeButton]}
                            onPress={() => setTimePeriod('week')}
                        >
                            <Text style={[styles.buttonText, timePeriod === 'week' && styles.activeButtonText]}>Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, timePeriod === 'month' && styles.activeButton]}
                            onPress={() => setTimePeriod('month')}
                        >
                            <Text style={[styles.buttonText, timePeriod === 'month' && styles.activeButtonText]}>Month</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Conditional Rendering of Charts */}
                {viewMode === 'pie' && <CategoryPieChart />}
                {viewMode === 'line' && <DateLineChart timePeriod={timePeriod} />}

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
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: Colors.light.tint,
        width: 100,
        height: 40, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        justifyContent: 'center', 
        alignItems: 'center', 
      },
      activeButton: {
        backgroundColor: Colors.light.tint,
        borderWidth: 0
      },
      buttonText: {
        color: 'black',
      },
      activeButtonText: {
        color: 'black',
      },
});