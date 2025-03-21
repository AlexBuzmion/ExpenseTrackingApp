import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme, ViewStyle, TextStyle, StyleProp, Platform } from 'react-native';
import {Text } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors'; // import your color constants

type ButtonVariant = 'primary' | 'secondary' | 'primary-alternative' | 'secondary-alternative' | 'primary-inverted'| 'secondary-inverted';

interface VariantStyles {
    container: ViewStyle;
    text: TextStyle;
}

// helper to return styles based on variant and color mode
const getVariantStyles = (
    variant: ButtonVariant,
    mode: 'light' | 'dark',
    borderWidthProp?: number 
): VariantStyles => {
    const defaultFilledBW = 0;
    const defaultOutlinedBW = 1.5;
    
    switch (variant) {
        case 'primary':
        return {
            container: {
            backgroundColor: Colors[mode].tint,
            borderColor: Colors[mode].tint,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultFilledBW,
            },
            text: { color: Colors[mode].background },
        };
        case 'primary-inverted': {
        const invertedMode = mode === 'light' ? 'dark' : 'light';
        return {
            container: {
            backgroundColor: Colors[invertedMode].tint,
            borderColor: Colors[invertedMode].tint,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultFilledBW,
            },
            text: { color: Colors[invertedMode].background },
        };
        }
        case 'secondary':
        return {
            container: {
            backgroundColor: 'transparent',
            borderColor: Colors[mode].tint,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultOutlinedBW,
            },
            text: { color: Colors[mode].tint },
        };
        case 'secondary-inverted': {
        const invertedMode = mode === 'light' ? 'dark' : 'light';
        return {
            container: {
            backgroundColor: 'transparent',
            borderColor: Colors[invertedMode].tint,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultOutlinedBW,
            },
            text: { color: Colors[invertedMode].tint },
        };
        }
        case 'primary-alternative':
        return {
            container: {
            backgroundColor: Colors[mode].background,
            borderColor: Colors[mode].background,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultFilledBW,
            },
            text: { color: Colors[mode].tint },
        };
        case 'secondary-alternative':
        return {
            container: {
            backgroundColor: 'transparent',
            borderColor: Colors[mode].background,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultOutlinedBW,
            },
            text: { color: Colors[mode].text },
        };
        default:
        // fallback to primary style if variant is not recognized
        return {
            container: {
            backgroundColor: Colors[mode].tint,
            borderColor: Colors[mode].tint,
            borderWidth: borderWidthProp !== undefined ? borderWidthProp : defaultFilledBW,
            },
            text: { color: Colors[mode].background },
        };
    }
};

interface CustomButtonProps {
    title: string;
    onPressFunc: () => void;
    variant?: ButtonVariant;
    borderWidth?: number;
    width?: any;
    height?: any;
    margin?: number;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean
}

const CustomButton: FC<CustomButtonProps> = ({
    title,
    onPressFunc,
    variant = 'primary',
    borderWidth,
    width,
    height,
    margin = 10,
    buttonStyle,
    textStyle,
    disabled,
}) => {
    const mode = useColorScheme() || 'light'; 
    const variantStyles = getVariantStyles(variant, mode, borderWidth);
    const defaultWidth = '90%'; 
    const defaultHeight = Platform.OS === 'ios' ? 70 : 60;
    // combine default styles with variant and any overrides
    const combinedButtonStyle = [
        styles.button, 
        { margin }, 
        variantStyles.container, 
        buttonStyle, 
        width !== undefined ? { width } : { width: defaultWidth},
        height !== undefined ? { height } : { height: defaultHeight}
    ];
    const combinedTextStyle = [styles.buttonText, variantStyles.text, textStyle];

    return (
        <TouchableOpacity
            style={combinedButtonStyle}
            onPress={onPressFunc}
            disabled={disabled? disabled : false}
        >
            <Text style={combinedTextStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        justifyContent: 'center',
        alignSelf: 'center',
      },
    buttonText: {
        fontSize: 20, 
        textAlign: 'center',
    },
});

export default CustomButton;
