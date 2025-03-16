import React, { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { View, Text } from '@/src/components/Themed';

interface QuestionItemProps {
    id: number;                   // question ID
    question: string;            // question text
    answers: string[];           // array of possible answers
    onAnswerSelect?: (id: number, answer: string) => void; // callback
}

export default function QuestionItem({
    id,
    question,
    answers,
    onAnswerSelect,
}: QuestionItemProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    const handleSelect = (answer: string) => {
        setSelectedAnswer(answer);
        if (onAnswerSelect) {
            onAnswerSelect(id, answer);
        }
    };

    return (
        <View style={[styles.container, { width }]}>
        <Text style={styles.questionText}>{question}</Text>
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(answer)}
              style={[
                styles.answerContainer,
                isSelected && styles.answerSelected,
              ]}
            >
              <Text>{answer}</Text>
            </Pressable>
          );
        })}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      questionText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
      },
      answerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginVertical: 4,
        width: '90%',
      },
      answerSelected: {
        borderColor: '#5a3286',
        backgroundColor: '#e6cff2',
      },
});
