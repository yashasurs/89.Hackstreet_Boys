export const config = {
  headerShown: false, // Disable the header
};

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { useAuth } from "../contexts/AuthContext";

interface Question {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer_option: string;
  answer_string: string;
}

const TakeTest = () => {
  const { content } = useLocalSearchParams();
  const { token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!token) {
      router.replace("../screen/login");
    }
  }, [token]);

  useEffect(() => {
    const generateQuestions = async () => {
      if (!content) {
        alert("No content available to generate questions.");
        return;
      }

      try {
        const response = await fetch("http://172.16.14.94:8000/api/generate-questions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            content: JSON.parse(content as string),
            num_questions: 10,
            difficulty: "hard",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error generating questions:", error);
        alert("Failed to generate questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      generateQuestions();
    }
  }, [content, token]);

  const handleAnswerSelect = (questionIndex: number, selectedOption: keyof Question) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: questions[questionIndex][selectedOption], // Store the full answer string
    }));
  };

  const handleFinishTest = () => {
    router.push({
      pathname: "./test-score",
      params: {
        selectedAnswers: JSON.stringify(selectedAnswers),
        questions: JSON.stringify(questions),
      },
    });
  };

  if (!token) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={images.bg} style={styles.backgroundImage} resizeMode="cover" />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" />
        ) : questions.length > 0 ? (
          <>
            <Text style={styles.title}>Test Questions</Text>
            {questions.map((q, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.question}>{index + 1}. {q.question}</Text>
                {(["option_a", "option_b", "option_c", "option_d"] as Array<keyof Question>).map((optionKey) => (
                  <TouchableOpacity
                    key={optionKey}
                    style={[
                      styles.optionButton,
                      selectedAnswers[index] === q[optionKey] && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelect(index, optionKey)}
                  >
                    <Text style={styles.optionText}>{q[optionKey]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <TouchableOpacity style={styles.finishButton} onPress={handleFinishTest}>
              <Text style={styles.finishButtonText}>Finish Test</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>No questions available. Please try again.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#2E2E3E",
    borderRadius: 8,
  },
  question: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#374151",
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: "#8B5CF6",
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  finishButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 20,
  },
});

export default TakeTest;