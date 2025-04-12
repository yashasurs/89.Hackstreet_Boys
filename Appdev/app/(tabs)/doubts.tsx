import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from 'react-native';
import { images } from '@/constants/images'; // Ensure this path is correct
import { useAuth } from '@/app/contexts/AuthContext'; // Import the AuthContext
import { Redirect } from 'expo-router';

const DoubtsScreen = () => {
    const { token, isAuthenticated } = useAuth(); // Get the token and authentication status from the AuthContext

    // Redirect to the login/register screen if the user is not authenticated
    if (!isAuthenticated || !token) {
        return <Redirect href="../screen/register" />;
    }

    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');

    const handleAsk = async () => {
        if (!question.trim()) {
            setResponse('Please enter a question.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/chatbot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`, // Ensure the token is passed correctly
                },
                body: JSON.stringify({ question }),
            });

            console.log('Response status:', res.status); // Log the response status
            if (!res.ok) {
                throw new Error('Failed to fetch response from the server.');
            }

            const data = await res.json();
            console.log('Response data:', data); // Log the response data

            // Ensure the response contains the "answer" field
            if (data && data.answer) {
                setResponse(data.answer);
            } else {
                setResponse('No response received from the server.');
            }
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error fetching response. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image
                source={images.bg} // Use the same background image as index.tsx
                style={styles.backgroundImage}
                resizeMode="cover"
                blurRadius={2}
            />

            <ScrollView
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <Text style={styles.title}>Ask a Question</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type your question here"
                    placeholderTextColor="#bbb"
                    value={question}
                    onChangeText={setQuestion}
                />
                <Button title="Ask" onPress={handleAsk} color="#8000FF" />
                <ScrollView style={styles.responseContainer}>
                    <Text style={styles.response}>{response}</Text>
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '700',
        marginTop: 80,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        color: '#fff',
    },
    responseContainer: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#1A1A1A',
    },
    response: {
        fontSize: 16,
        color: '#fff',
    },
});

export default DoubtsScreen;