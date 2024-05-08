import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import UserContext from './UserContext'; // Import the user context
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const StudentLoginScreen = ({ }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const { updateRollNo, updateDept } = useContext(UserContext); // Access updateRollNo function from context
    // const { updateDept } = useContext(UserContext); 

    const navigation = useNavigation();
    const handleLogin = async () => {
        // Validate the student email
        // if (!validateEmail(email)) {
        //     setError('Please enter a valid email address from @smail.iitm.ac.in domain.');
        //     return; // Do not proceed if email is invalid
        // } else {
        //     setError(''); // Clear error if email is valid
        // }
        // Extract roll number from email (example logic)
        const rollNo = extractRollNoFromEmail(email);
        console.log('rollNo during login:', rollNo);
        // Make API call to execute GetEnrollment smart contract function
        // Define the API endpoint and parameters
        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetEnrollment'; // Replace with your API base URL
        const chaincodeid = 'basic';
        const channelid = 'mychannel';
        const functionName = 'GetEnrollment';
        const args = rollNo;
        console.log('rollNo during arg:', args);
        try {
            // Construct the complete URL with query parameters
            const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${args}`;

            const response = await axios.post(apiURL);
            console.log('API Response for studentLogin:', response.data); // Log the API response data
            if (response.status === 200) {
                const enrollmentData = response.data;
                if (enrollmentData.name) {
                    // Update the global state with the roll number
                    updateRollNo(rollNo);
                    updateDept(enrollmentData.department);
                    setIsLoggedIn(true);
                    navigation.navigate('StudentDashboard');
                } else {
                    // setError('Enrollment not found.');
                    setError(response.data);

                }
            } else {
                throw new Error('Failed to execute GetEnrollment.');
            }
        } catch (error) {
            console.error('Error executing GetEnrollment:', error);
            setError('Failed to check enrollment. Please try again.');
        }
        // For simplicity, just set isLoggedIn to true
        setIsLoggedIn(true);

        // // Navigate to StudentDashboard with roll number as a parameter
        // navigation.navigate('StudentDashboard', { });
    };

    const extractRollNoFromEmail = (email) => {
        // Implement logic to extract roll number from email (e.g., substring)
        const parts = email.split('@');
        const rollNo = parts[0]; // Assume roll number is before '@'
        return rollNo.toUpperCase(); // Convert roll number to uppercase
    };

    const validateEmail = (email) => {
        // // Basic email validation using regex
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // return regex.test(email);
        // Basic email validation: Check if email ends with '@smail.iitm.ac.in'
        const domain = '@smail.iitm.ac.in';
        return email.endsWith(domain);
    };

    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Student Login</Title>
                    <TextInput
                        style={styles.input}
                        placeholder="Student Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Student Password"
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
export default StudentLoginScreen;
