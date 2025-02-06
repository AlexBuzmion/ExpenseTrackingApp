import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { View, Text } from '@/src/components/Themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import styles for web

type CrossPlatformDatePickerProps = {
    value?: Date
    onChange?: (date: Date) => void
}

export function CrossPlatformDatePicker({ value, onChange }: CrossPlatformDatePickerProps){
    const [date, setDate] = useState(value || new Date());
    const [dateVisibility, setDateVisibility] = useState(false);

    function toggleDatePickerVisibility() {
        setDateVisibility(!dateVisibility);
    }

    // ✅ Sync state with parent
    useEffect(() => {
        if (value && value.getTime() !== date.getTime()) {
            setDate(value);
        }
    }, [value]);

    function onChangeDate(event: any, selectedDate?: Date) {
        if(selectedDate) {
            setDate(selectedDate);
        }
        setDateVisibility(false);
        if (onChange) {
            onChange(selectedDate || new Date());
        }
    }

    function confirmDateIOS() {
        setDateVisibility(false);
    }

    return (
        <View style={[styles.inputContainer, styles.wrapper]}>
            {Platform.OS === 'web' ? (
                <DatePicker
                    selected={date}
                    onChange={(selectedDate) => {
                        setDate(selectedDate || new Date()); // Update local state
                        if (onChange) onChange(selectedDate || new Date()); // Pass to parent
                    }}
                    dateFormat='yyyy-MM-dd'
                    className='custom-datepicker'
                    popperPlacement='bottom-start'
                    showPopperArrow={false}
                    portalId='root'
                    calendarContainer={({ children }) => (
                        <div style={{ position: 'absolute', zIndex: 9999, backgroundColor: 'gray' }}>{children}</div>
                    )}
                />
            ) : (
                // mobile (iOS/Android) uses native DateTimePicker
                <>
                <TouchableOpacity onPress={toggleDatePickerVisibility}>
                    <Text>{date.toDateString()}</Text>
                </TouchableOpacity>

                {dateVisibility && (
                    <DateTimePicker
                    mode='date'
                    display={Platform.OS === 'ios' ? 'compact' : 'spinner'}
                    
                    value={date}
                    onChange={onChangeDate}
                    />
                )}

                {dateVisibility && Platform.OS === 'ios' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={toggleDatePickerVisibility}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{ padding: 10 }} onPress={confirmDateIOS}>
                        <Text>Confirm</Text>
                    </TouchableOpacity> */}
                    </View>
                )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 40,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        maxWidth: 150,
    },
    currencySymbol: {
        fontSize: 16,
        marginRight: 1
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8
    },
    errorText: {
        marginTop: 4,
        color: '#EF5350'
    },
    title: {
        fontSize: 16,
        flex: .28,
        padding: 5
    }
});
