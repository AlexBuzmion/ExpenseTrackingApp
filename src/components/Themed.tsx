import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput, Animated } from 'react-native';
import { Dropdown as DefaultDropdown } from 'react-native-element-dropdown';
import { Svg as DefaultSvg, Path as DefaultPath, Text as DefaultSVGText, G as DefaultG } from 'react-native-svg';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { TextStyle, ViewStyle, StyleProp } from 'react-native';

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

// Types for SVG elements
export type SvgProps = ThemeProps & React.ComponentProps<typeof DefaultSvg>;
export type PathProps = ThemeProps & React.ComponentProps<typeof DefaultPath>;
export type SVGTextProps = ThemeProps & React.ComponentProps<typeof DefaultSVGText>;
export type GProps = ThemeProps & React.ComponentProps<typeof DefaultG>;

// Add type for Dropdown, with containerStyle
export type DropdownProps = ThemeProps & Omit<React.ComponentProps<typeof DefaultDropdown>, 'style'> & {
    containerStyle?: StyleProp<ViewStyle>;  // Style for the OUTER container
    style?: StyleProp<TextStyle>;          // Style for the TEXT elements *within* the dropdown
};

// Add type for Animated.View
type AnimatedViewProps = ThemeProps & Animated.AnimatedProps<ViewProps>;
// --- Animated.View Component ---
export const AnimatedView = Animated.createAnimatedComponent(View);


export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? 'light';
    return props[theme] ?? Colors[theme][colorName];
}

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function InputText(props: TextInputProps) {
    const { style, lightColor, darkColor, placeholderTextColor, ...otherProps } = props;
    const textColor = useThemeColor({ light: lightColor, dark: "#fff" }, 'text');
    const backgroundColor = useThemeColor({ light: lightColor, dark: '#222' }, 'background');
    const placeholderColor = useThemeColor({ light: '#fff', dark: '#888' }, 'text');

    return (
        <DefaultTextInput
            style={[{ color: textColor, backgroundColor, padding: 10, borderRadius: 8 }, style]}
            placeholderTextColor={placeholderTextColor ?? placeholderColor}
            {...otherProps}
        />
    );
}

// --- SVG Components ---

export function Svg(props: SvgProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <DefaultSvg style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Path(props: PathProps) {
    const { lightColor, darkColor, ...otherProps } = props;
    const stroke = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const fill = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <DefaultPath {...otherProps} stroke={stroke} fill={fill} />;
}

export function SVGText(props: SVGTextProps) {
    const { lightColor, darkColor, ...otherProps } = props;
    const fill = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultSVGText {...otherProps} fill={fill} />;
}

export function G(props: GProps) {
    const { lightColor, darkColor, ...otherProps } = props;
    const fill = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const stroke = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultG {...otherProps} fill={fill} stroke={stroke} />;
}

// --- Dropdown Component ---
export function Dropdown(props: DropdownProps) {
    const { containerStyle, style, lightColor, darkColor, ...otherProps } = props;

    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
    const placeholderColor = useThemeColor({ light: '#888', dark: '#bbb' }, 'text');
    const itemBackgroundColor = useThemeColor({ light: '#eee', dark: '#333' }, 'background');
    const itemTextColor = useThemeColor({ light: '#333', dark: '#eee' }, 'text');
    const iconColor = useThemeColor({light: lightColor, dark: darkColor}, 'text');
    return (
        <DefaultDropdown
            style={[{ backgroundColor }, containerStyle]} // Text styles (for selected item)
            //containerStyle={[{ backgroundColor }, containerStyle]} // Outer container
            placeholderStyle={[{ color: placeholderColor }, style]}
            selectedTextStyle={[{ color: textColor }, style]}
            inputSearchStyle={[{ color: textColor }, style]}
            itemTextStyle={[{ color: itemTextColor }, style]}
            itemContainerStyle={[{ backgroundColor: itemBackgroundColor }]}
            activeColor={itemBackgroundColor}
            {...otherProps}
        />
    );
}
