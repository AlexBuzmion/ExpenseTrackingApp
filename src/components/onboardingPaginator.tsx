import {StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { View } from '@/src/components/Themed';

export default function OnboardingPaginator({data, scrollX }: any) {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { flexDirection: 'row', height: 64 }]}>
            {data.map((_:any, index: any) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 30, 10],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.4, 1, 0.4],
                    extrapolate: 'clamp',
                })

                return <Animated.View style={[styles.dot, {width: dotWidth, opacity}]} key={index.toString()} />
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#5a3286',
        marginHorizontal: 8,
    }
})