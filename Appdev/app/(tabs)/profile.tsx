import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth for logout functionality
import { images } from "@/constants/images"; // Import the background image

const Profile = () => {
    const { logout, token } = useAuth(); // Access the logout function and token from AuthContext
    const [profileData, setProfileData] = useState({ username: '', email: '', average_score: 0.0 });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch('http://172.16.14.94:8000/api/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`, // Include the token in the Authorization header
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setProfileData({
                    username: data.username,
                    email: data.email,
                    average_score: data.average_score,
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [token]);

    return (
        <View style={styles.container}>
            <Image
                source={images.bg} // Use the same background image as index.tsx
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Profile</Text>
                <View style={styles.profileInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Username:</Text>
                        <Text style={styles.value}>{profileData.username}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{profileData.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Average Score:</Text>
                        <Text style={styles.value}>{profileData.average_score}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
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
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        minHeight: "100%",
        paddingBottom: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 30,
        marginTop: 80,
    },
    profileInfo: {
        backgroundColor: "#1E1E2C",
        borderRadius: 12,
        padding: 20,
        width: "100%",
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#A8B5DB",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Profile;