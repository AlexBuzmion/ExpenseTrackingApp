// import { View } from '@/src/components/Themed';
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

export default function NextButton({percentage, scrollTo } : any) {
    const size = 100; 
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null); 
    const animation = (totalValue : any) => {
        return Animated.timing(progressAnim, {
            toValue: totalValue,
            duration: 250, 
            useNativeDriver: true,            
        }).start();
    }

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnim.addListener(
            (value) => {
                const strokeDashoffset = circumference - (circumference * value.value) / 100;
                if (progressRef?.current) {
                    (progressRef.current as any).setNativeProps({
                        strokeDashoffset,
                    });
                }
            }, 
            [percentage]
        );
        return () => {
            progressAnim.removeAllListeners();
        }
    }, []);

    
    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation={-90} origin={center}>
                    <Circle stroke="#5a3286" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
                    <Circle 
                        stroke="#e6cff2" 
                        cx={center} 
                        cy={center} 
                        r={radius} 
                        strokeWidth={strokeWidth} 
                        strokeDasharray={circumference} 
                        ref={progressRef} 
                    />
                </G>
            </Svg>
            <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={scrollTo}>
                <AntDesign name="arrowright" size={66} color="#5a3286" />
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
    button: {
        position: 'absolute',
        backgroundColor: '#e6cff2',
        borderRadius: 100,
        padding: 15.2,
    }
});