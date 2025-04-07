import React, { forwardRef, useState, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInputProps, ViewStyle, StyleProp, Platform, useColorScheme } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Text, InputText as ThemedInputText } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';

interface CustomInputTextProps extends TextInputProps {
    headerTitle?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputInstructions?: ReactNode;
}

export const InputTextField = forwardRef<any, CustomInputTextProps>(
    (props, ref) => {
        const {
            headerTitle,
            secureTextEntry,
            containerStyle,
            style,
            inputInstructions,
            ...otherProps
        } = props;

        const [passwordVisible, setPasswordVisible] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const computedSecureTextEntry = secureTextEntry ? !passwordVisible : false;

        const handleFocus = () => {
            setIsFocused(true);
        };

        const handleBlur = () => {
            setIsFocused(false);
        };

        return (
            <View style={[styles.container, containerStyle]}>
                {headerTitle ? <Text style={styles.header}>{headerTitle}</Text> : null}
                <View style={styles.inputWrapper}>
                    <ThemedInputText
                        ref={ref}
                        secureTextEntry={computedSecureTextEntry}
                        style={[styles.input, style]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                                color={useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {isFocused && inputInstructions && (
                    <View style={styles.instructionsContainer}>
                        {inputInstructions}
                    </View>
                )}
            </View>
        );
    }

);

const styles = StyleSheet.create({
    container: {
        width: '84%',
        alignSelf: 'center',
        marginBottom: '2%',
    },
    header: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        height: Platform.OS === 'ios' ? 56 : 46,
        fontSize: 16,
    },
    iconContainer: {
        paddingHorizontal: 16,
    },
    instructionsContainer: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
});