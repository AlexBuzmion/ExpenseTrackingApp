import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { forwardRef } from 'react';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

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

export const InputText = forwardRef<DefaultTextInput, TextInputProps>((props, ref) => {
  const { style, lightColor, darkColor, placeholderTextColor, ...otherProps } = props;
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const placeholderColor = useThemeColor({ light: '#888', dark: '#bbb' }, 'text');

  // comment: pass the ref through to the underlying native text input
  return (
    <DefaultTextInput
      ref={ref}
      style={[{ color: textColor, backgroundColor, padding: 10, borderRadius: 8 }, style]}
      placeholderTextColor={placeholderTextColor ?? placeholderColor}
      {...otherProps}
    />
  );
});
