import React, { useState, useRef, useEffect } from 'react';
import { View } from '@/src/components/Themed';
import { Text, StyleSheet, FlatList, Animated, TouchableOpacity } from 'react-native';
import onboardingQuestions from '@/utils/onboardingQuestions';
import QuestionItem from '@/src/components/questionItem';
import OnboardingPaginator from '@/src/components/onboardingPaginator';
import NextButton from '@/src/components/nextButton';
import { useRouter } from 'expo-router';

interface QuestionnaireProps {
  initialAnswers?: Record<number, string>;
  onCategoriesGenerated?: (answers: Record<number, string>) => void;
}

const QuestionnaireSection: React.FC<QuestionnaireProps> = ({
  initialAnswers = {},
  onCategoriesGenerated,
}) => {
  const router = useRouter();
  const [questions, setQuestions] = useState(onboardingQuestions);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const handleSetAnswer = (id: number, answer: string) => {
    if (id === 1 && answer.startsWith('A')) {
      setQuestions(prev => prev.filter(q => q.id !== 2));
    } else if (id === 1 && !answer.startsWith('A')) {
      setQuestions(onboardingQuestions);
    }
    setAnswers(prev => ({ ...prev, [id]: answer[0] }));
  };

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
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
      <View
        style={{
          flex: 0.2,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        {currentIndex + 1 === questions.length &&
          Object.entries(answers).length === questions.length ? (
            // Call onCategoriesGenerated directly when the button is pressed
          <TouchableOpacity style={styles.nextButton} onPress={() => onCategoriesGenerated && onCategoriesGenerated(answers)}>
            <Text> Continue </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <NextButton
        percentage={(currentIndex + 1) * (100 / onboardingQuestions.length)}
        scrollTo={scrollTo}
      />
    </View>
  );
};

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

export default QuestionnaireSection;