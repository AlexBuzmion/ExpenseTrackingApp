import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text } from '@/src/components/Themed';
import CategoryPieChart from '@/src/components/CategoryPieChart';

export default function AnalyticsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Expense Analytics</Text>
                <CategoryPieChart />
                {/* Add other analytics (probably in a dropdown menu) */}
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
        justifyContent: 'flex-start',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});