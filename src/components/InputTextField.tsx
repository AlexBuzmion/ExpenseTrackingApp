import React, { forwardRef, useState, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInputProps, ViewStyle, StyleProp, Platform, useColorScheme, } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Text, InputText as ThemedInputText } from '@/src/components/Themed'; // your existing themed component
import Colors from '@/src/constants/Colors';

interface CustomInputTextProps extends TextInputProps {
  headerTitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const InputTextField = forwardRef<any, CustomInputTextProps>(
    (props, ref) => {
        const {
            headerTitle,
            secureTextEntry,
            containerStyle,
            style,
            ...otherProps
        } = props;
        // state for toggling password visibility if secureTextEntry is provided
        const [passwordVisible, setPasswordVisible] = useState(false);
        const computedSecureTextEntry = secureTextEntry ? !passwordVisible : false;

        return (
        <View style={[styles.container, containerStyle]}>
            {headerTitle ? <Text style={styles.header}>{headerTitle}</Text> : null}
            <View style={styles.inputWrapper}>
            <ThemedInputText
                ref={ref}
                secureTextEntry={computedSecureTextEntry}
                style={[styles.input, style]}
                {...otherProps}
            />
            {secureTextEntry && (
                <TouchableOpacity
                onPress={() => setPasswordVisible((prev) => !prev)}
                style={styles.iconContainer}
                >
                <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={28}
                    color={ useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint}
                />
                </TouchableOpacity>
            )}
            </View>
        </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        marginBottom: '4%',
    },
    header: {
        fontSize: 16,
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        padding: 10,
        height: Platform.OS === 'ios' ? 64 : 54,
        fontSize: 16,
    },
    iconContainer: {
        paddingHorizontal: 16,
    },
});
