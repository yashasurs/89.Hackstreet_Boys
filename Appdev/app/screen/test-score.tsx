export const config = {
  headerShown: false, // Disable the header
};

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface Question {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer_option: string;
  answer_string: string;
}

const TestScore = () => {
  const { selectedAnswers, questions } = useLocalSearchParams();

  const parsedSelectedAnswers: { [key: number]: string } = (() => {
    try {
      return JSON.parse(Array.isArray(selectedAnswers) ? selectedAnswers[0] : selectedAnswers || "{}");
    } catch {
      return {};
    }
  })();

  const parsedQuestions: Question[] = (() => {
    try {
      return JSON.parse(Array.isArray(questions) ? questions[0] : questions || "[]");
    } catch {
      return [];
    }
  })();

  const wrongAnswers = parsedQuestions.filter((q, index) => {
    const selectedAnswer = parsedSelectedAnswers[index];
    return selectedAnswer !== q.answer_string; // Compare directly with answer_string
  });

  const correctAnswersCount = parsedQuestions.length - wrongAnswers.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Results</Text>
      <Text style={styles.score}>Your Score: {correctAnswersCount}</Text>

      {wrongAnswers.length > 0 ? (
        <>
          <Text style={styles.subtitle}>Wrong Answers:</Text>
          {wrongAnswers.map((q, index) => (
            <View key={index} style={styles.wrongAnswerContainer}>
              <Text style={styles.question}>{index + 1}. {q.question}</Text>
              <Text style={styles.correctAnswer}>Correct Answer: {q.answer_string}</Text>
              <Text style={styles.selectedAnswer}>
                Your Answer: {parsedSelectedAnswers[index] || "Not Answered"}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.noWrongAnswers}>Great job! All answers are correct.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    color: "#8B5CF6",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  wrongAnswerContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#2E2E3E",
    borderRadius: 8,
    width: "100%",
  },
  question: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  correctAnswer: {
    fontSize: 16,
    color: "#8B5CF6",
    marginBottom: 5,
  },
  selectedAnswer: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  noWrongAnswers: {
    fontSize: 18,
    color: "#8B5CF6",
    textAlign: "center",
    marginTop: 20,
  },
});

export default TestScore;