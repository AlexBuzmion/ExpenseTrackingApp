import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, InputText } from '@/src/components/Themed';

type CurrencyInputFieldProps = {
    value?: string;
    onValidChange?: (value: string) => void;
    inputTitle?: string;
}

export function CurrencyInputField( {value, onValidChange, inputTitle}: CurrencyInputFieldProps )
{
    const [textValue, setTextValue] = useState(value || '0.00');
    const [inputError, setInputError] = useState(false);

    useEffect(() => {
        if (value !== textValue) {
            setTextValue(value || '0.00');
        }
    }, [value]); // Re-run effect when `value` prop changes

    // clears placeholder when user focuses the field if still '0.00'
    function handleFocus() {
        if(textValue === '0.00') {
        setTextValue('');
        }
    }

    // checks against currency pattern, toggles error on invalid input
    function handleChangeText(input: string) {
        // allow empty (user might be deleting everything)
        if(input.length === 0) {
            setTextValue('');
            setInputError(false);
            if(onValidChange) { onValidChange('0'); }
            return;
        }

        // only digits, optional decimal, up to 2 decimals
        const currencyPattern = /^[0-9]+(\.[0-9]{0,2})?$/;
        if(!currencyPattern.test(input)) {
            setInputError(true);
            return;
        }

        // if valid, clear any error and update text
        setInputError(false);
        setTextValue(input);
        if(onValidChange) {onValidChange(input);}
    }

    return (
        <View style={styles.wrapper}>
        <View style={styles.inputContainer} lightColor="#fff" darkColor="#222">
            <Text style={styles.title}>{inputTitle}  </Text>
            <Text style={styles.currencySymbol}>$</Text>
            <InputText
                style={styles.input}
                keyboardType='decimal-pad'
                value={textValue}
                onFocus={handleFocus}
                onChangeText={handleChangeText}
                placeholder='0.00'
                onBlur={() => setInputError(false)}
            />
        </View>
        {inputError && <Text style={styles.errorText}>Invalid input!</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        // marginVertical: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        maxWidth: 400,
    },
    currencySymbol: {
        fontSize: 16,
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
        // padding: 5
    }
});
