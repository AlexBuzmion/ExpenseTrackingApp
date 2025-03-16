import { View } from '@/src/components/Themed';
import { useState, useRef } from 'react';
import { StyleSheet, FlatList, Animated } from 'react-native';
import onboardingQuestions from '@/utils/onboardingQuestions';
import NextButton from '@/src/components/nextButton';
import QuestionItem from '@/src/components/questionItem';
import OnboardingPaginator from '@/src/components/onboardingPaginator';

export default function AccountSetupScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const viewableItemsChanged = useRef(({ viewableItems } : any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    // require 50% scroll on the screen before moving to the next question
    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50 }).current; 
    const onboardingRef = useRef<FlatList>(null);

    const scrollTo = () => {
        if (currentIndex < onboardingQuestions.length - 1) {
            onboardingRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            console.log('Last Item');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={onboardingQuestions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <QuestionItem
                            id={item.id}
                            question={item.question}
                            answers={item.answers}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                    ref={onboardingRef}
                />
                </View>
                <OnboardingPaginator data={onboardingQuestions} scrollX={scrollX} />
                <NextButton percentage={(currentIndex + 1) * (100 / onboardingQuestions.length)} scrollTo={scrollTo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});