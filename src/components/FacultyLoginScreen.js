// FacultyScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import UserContext from './UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library


const FacultyScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { updateFacultyID } = useContext(UserContext); // Access updateRollNo function from context

    const navigation = useNavigation();
    const handleLogin = async () => {
        // Handle faculty login logic
        // onLogin();
        if (!email) {
            setError('Please enter a valid faculty ID (e.g F1)');
            return; // Do not proceed if email is invalid
        } else {
            setError(''); // Clear error if email is valid
        }


        const facultyID = email;
        console.log('facultyID during login:', facultyID);
        updateFacultyID(facultyID);

        navigation.navigate('FacultyDashboard');
    };

    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Faculty Login</Title>
                    <TextInput
                        style={styles.input}
                        placeholder="Faculty Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Faculty Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />

                    <PaperButton
                        mode="contained"
                        style={styles.button}
                        onPress={handleLogin}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Login
                    </PaperButton>
                </Card.Content>
            </Card>
            <View style={styles.bottomBar}>
                <PaperButton
                    style={styles.bottomBarButton}
                    onPress={() => navigation.goBack()}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={40} color="#7E57C2" />
                            {/* <Text style={styles.bottomBarText}>Home</Text> */}
                        </>
                    )}
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Light background color
    },
    card: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#7E57C2',
        fontWeight: 'bold',
        fontSize: 24,
    },
    input: {
        height: 40,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        marginVertical: 5,
        borderRadius: 8,
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        height: 56,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF', // White background color
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0', // Light gray border color
    },
    bottomBarButton: {
        backgroundColor: 'transparent', // Make the button background transparent
    },
    bottomBarText: {
        color: '#7E57C2', // Blue text color
        marginTop: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default FacultyScreen;



