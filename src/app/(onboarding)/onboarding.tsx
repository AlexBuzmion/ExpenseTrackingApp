import { View } from '@/src/components/Themed';
import { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, FlatList, Animated, Pressable, TouchableOpacity } from 'react-native';
import onboardingQuestions from '@/utils/onboardingQuestions';
import NextButton from '@/src/components/nextButton';
import QuestionItem from '@/src/components/questionItem';
import OnboardingPaginator from '@/src/components/onboardingPaginator';
import { useRouter } from 'expo-router';

export default function AccountSetupScreen() {
    const router = useRouter();
    const [questions, setQuestions] = useState(onboardingQuestions);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [answers, setAnswers] = useState({});

    
    const viewableItemsChanged = useRef(({ viewableItems } : any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const handleSetAnswer = ( id: number , answer: string) => {
        if (id === 1 && answer.startsWith('A')) {
            setQuestions(prev => prev.filter(q => q.id !== 2));
        } else if (id === 1 && !answer.startsWith('A')) {
            setQuestions(onboardingQuestions);
        }
        setAnswers(prev => ({ ...prev, [id]: answer.at(0) }));
    };

    const handleGenerateCats = () => {
        if (questions.length === Object.keys(answers).length) {
            router.replace({
                pathname: '/(onboarding)/suggestedCats',
                params: { answers: JSON.stringify(answers) }
            })
        }
    }

    // useEffect(() => {
    //     console.log(answers);
    // }, [answers]);

    // require 50% scroll on the screen before moving to the next question
    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50 }).current; 
    const onboardingRef = useRef<FlatList>(null);
    
    const scrollTo = () => {
        if (currentIndex < questions.length - 1) {
            onboardingRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            console.log('Last Item');
        }
    };

    return (
        
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1.5 }}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <QuestionItem
                        id={item.id}
                        question={item.question}
                        answers={item.answers}
                        onAnswerSelect={handleSetAnswer}
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
            <OnboardingPaginator data={questions} scrollX={scrollX} />
            <View style={{ flex: .2, position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                { currentIndex + 1  === questions.length  && ( Object.entries(answers).length === questions.length )
                    ? (<TouchableOpacity 
                            style={styles.nextButton}
                            onPress={handleGenerateCats} 
                        >
                            <Text>   Continue   </Text> 
                        </TouchableOpacity>) 
                    : null
                }
            </View>
                <NextButton percentage={(currentIndex + 1) * (100 / onboardingQuestions.length)} scrollTo={scrollTo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        position: 'absolute',
        backgroundColor: '#e6cff2',
        borderRadius: 100,
        padding: 15.2,
        
    },
});