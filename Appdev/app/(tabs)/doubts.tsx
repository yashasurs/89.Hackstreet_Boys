import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
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
            const res = await fetch('http://172.16.14.94:8000/api/chatbot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`, // Ensure the token is passed correctly
                },
                body: JSON.stringify({ question }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch response from the server.');
            }

            const data = await res.json();

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
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Ask AI Anything</Text>

                {/* Input Field */}
                <TextInput
                    style={styles.input}
                    placeholder="Type your question here..."
                    placeholderTextColor="#bbb"
                    value={question}
                    onChangeText={setQuestion}
                />

                {/* Ask Button */}
                <TouchableOpacity style={styles.askButton} onPress={handleAsk}>
                    <Text style={styles.askButtonText}>Ask</Text>
                </TouchableOpacity>

                {/* Response Container */}
                {response ? (
                    <View style={styles.responseContainer}>
                        <Text style={styles.response}>{response}</Text>
                    </View>
                ) : null}
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
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        color: '#fff',
        fontSize: 16,
    },
    askButton: {
        backgroundColor: '#8000FF',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#8000FF',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    askButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    responseContainer: {
        width: '100%',
        backgroundColor: '#1C1C1C',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        shadowColor: '#9A40FF',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    response: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
});

export default DoubtsScreen;