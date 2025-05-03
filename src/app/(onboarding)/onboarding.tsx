import { View } from '@/src/components/Themed';
import { useState, useRef } from 'react';
import { Text, StyleSheet, FlatList, Animated, TouchableOpacity, Platform } from 'react-native';
import onboardingQuestions from '@/utils/onboardingQuestions';
import NextButton from '@/src/components/nextButton';
import QuestionItem from '@/src/components/questionItem';
import OnboardingPaginator from '@/src/components/onboardingPaginator';
import { useRouter } from 'expo-router';
import CustomButton from '@/src/components/CustomButton';

export default function AccountSetupScreen() {
    const router = useRouter();
    const [questions, setQuestions] = useState(onboardingQuestions);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const flatListRef = useRef<FlatList>(null);

    const currentQuestionId = questions[currentIndex]?.id;
    const isCurrentQuestionAnswered = answers.hasOwnProperty(currentQuestionId);

    const handleSetAnswer = (id: number, answer: string) => {
        const newAnswers = { ...answers, [id]: answer.at(0) };
    
        if (id === 1 && answer.startsWith('A')) {
            const updatedQuestions = onboardingQuestions.filter(q => q.id !== 2);
            const updatedAnswers = Object.fromEntries(
                Object.entries(newAnswers).filter(([key]) =>
                    updatedQuestions.some(q => q.id.toString() === key)
                )
            );
            setQuestions(updatedQuestions);
            setAnswers(updatedAnswers);
        } else if (id === 1 && !answer.startsWith('A')) {
            setQuestions(onboardingQuestions);
            setAnswers(newAnswers);
        } else {
            setAnswers(newAnswers);
        }
    };
    

    const handleGenerateCats = () => {
        if (questions.length === Object.keys(answers).length) {
            router.replace({
                pathname: '/(onboarding)/suggestedCats',
                params: { answers: JSON.stringify(answers) }
            })
        }
    }

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = () => {
        if (currentIndex < questions.length - 1 && isCurrentQuestionAnswered) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else if (currentIndex === questions.length - 1) {
            console.log('Last Item');
        } else {
            alert('Please answer the current question.');
            //console.log('Please answer the current question.');
        }
    };

    const handleReset = () => {
        router.replace('/(onboarding)/onboarding');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 3 }}>
                <FlatList
                    ref={flatListRef}
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
                    scrollEnabled={isCurrentQuestionAnswered} // Control scrolling based on whether the current question is answered
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    //viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                />
            </View>
            <OnboardingPaginator data={questions} scrollX={scrollX} />
            <View style={{ flex: .2, position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                {currentIndex + 1 === questions.length && (Object.entries(answers).length === questions.length)
                    ? (<TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleGenerateCats}
                    >
                        <Text>  Continue  </Text>
                    </TouchableOpacity>)
                    : null
                }
            </View>
            {/* <NextButton
                percentage={(currentIndex + 1) * (100 / onboardingQuestions.length)}
                scrollTo={scrollToNext}
                disabled={!isCurrentQuestionAnswered} // Disable the next button if the current question isn't answered
            /> */}
            {/* <CustomButton
                title='Next'
                onPressFunc={scrollToNext}
                variant="primary"
                width={Platform.OS === 'ios' ? 150 : 140}
                height={60}
                borderWidth={1}
            /> */}
            <CustomButton
                title='Cancel'
                onPressFunc={() => router.navigate("/profile")}
                variant="secondary"
                width={Platform.OS === 'ios' ? 150 : 140}
                height={60}
                borderWidth={1}
            />
            <CustomButton
                onPressFunc={handleReset}
                title="Reset"
                height={Platform.OS === 'ios' ? 28 : 30}
                width={'30%'}
                margin={5}
                variant='secondary-alternative'
                textStyle={{ color: '#e6cff2' }}
            />
            
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