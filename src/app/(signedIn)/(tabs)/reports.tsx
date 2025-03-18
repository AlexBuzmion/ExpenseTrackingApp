import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useEntriesStore } from '@/store/entriesStore';
import { CrossPlatformDatePicker } from '@/src/components/CrossPlatformDatePicker';
import { useState } from 'react';
import { generateCSV, generatePDF } from '@/utils/exportUtils';
import { endOfDay, startOfDay } from 'date-fns';

export default function TabTwoScreen() {
    const listStore = useEntriesStore();
    const allExpenses =Object.entries(listStore.itemEntryList).map(([id, expense]) => ({ id, ...expense }));
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const [endDate, setEndDate] = useState(endOfDay(new Date()));
    const [csvIsLoading, setCSVIsLoading] = useState(false);
    const [pdfIsLoading, setPDFIsLoading] = useState(false);

    function handleGenerateCSV() {
        setCSVIsLoading(true)
        generateCSV(allExpenses, startDate, endDate).then(() => {
            setCSVIsLoading(false);
        }).catch(err => {
            setCSVIsLoading(false); 
            console.log(err)
        });
    }

    function handleGeneratePDF() {
        console.log('generating pdf');
        setPDFIsLoading(true);
        generatePDF(allExpenses, startDate, endDate).then(() => {
            setPDFIsLoading(false);
        }).catch(err => {
            setPDFIsLoading(false); 
            console.log(err);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Date Range</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{marginRight: 10}}>
                    <CrossPlatformDatePicker 
                        value={startDate}
                        onChange={val => setStartDate(startOfDay(val))}
                    />
                </View>
                <CrossPlatformDatePicker 
                    value={endDate}
                    onChange={val => setEndDate(endOfDay(val))}
                />
            </View>
            <Text style={styles.title}>Export Lists</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            
            <TouchableOpacity 
                style={[styles.button, { borderWidth: 1, margin: 10 }]} 
                onPress={handleGeneratePDF}
                disabled={pdfIsLoading}
            >
                { pdfIsLoading ? <ActivityIndicator /> : <Text>Export PDF</Text>  }
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.button, { borderWidth: 1, margin: 10 }]} 
                onPress={handleGenerateCSV}
                disabled={csvIsLoading}
            >
                {csvIsLoading ? <ActivityIndicator size="small" style={{ alignContent: 'center', justifyContent: 'center'}}/> : <Text>Export CSV</Text> }
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    button: {
		borderRadius: 20,
		width: 100,
		height: 40, 
		justifyContent: 'center', 
		alignItems: 'center',
        
	}
});
