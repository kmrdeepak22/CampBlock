import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

import axios from 'axios'; // Import axios

const NewProgramRegistrationScreen = ({ navigation }) => {
//    facultyID string, facultyName string, departmentID string
    const [programName, setProgramName] = useState('');
    const [maxSemesters, setMaxSemesters] = useState('');
    
    const [requiredCredits, SetRequiredCredits] = useState('');
    const [maxCreditPerSemester, setMaxCreditPerSemester] = useState('');
    const [minCreditPerSemester, setMinCreditPerSemester] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!programName || !maxSemesters || !requiredCredits || !maxCreditPerSemester || !minCreditPerSemester) {
            setError('Please fill out all fields.');
            return;
    }
        
        
        // programName string, maxSemesters int, requiredCredits int, maxCreditPerSemester int

        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddProgram';


        const formData = new URLSearchParams();
        formData.append("args", programName.toUpperCase());
        formData.append("args", maxSemesters);
        formData.append("args", requiredCredits);
        formData.append("args", maxCreditPerSemester);
        formData.append("args", minCreditPerSemester);
        // formData.append("args", JSON.stringify(coursesToAdd));


        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('AddProgram response:', response.data);
            Alert.alert(`Added ${programName} into Programs`);
            setError('Successfully Registered.');
            return;
            // Handle success (if needed)
        } catch (error) {
            // console.error('Error Registering Program:', error);
            Alert.alert('Error', 'Failed to Add');
            setError('Error Registering Program.');
            return;
            // Handle error (if needed)
            // throw new Error('Registration failed');
        }

        // Clear form fields after registration
        // setRollNo('');
        // setName('');
        // setProgram('');
        // setDepartment('');

    };

    return (
        // <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Card elevation={5} style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Program to be added...</Title>

                    <TextInput
                        style={styles.input}
                            placeholder="Program Name"
                            onChangeText={setProgramName}
                            value={programName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Max Semesters"
                        onChangeText={setMaxSemesters}
                        value={maxSemesters}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Total Required Credits"
                            onChangeText={SetRequiredCredits}
                            value={requiredCredits}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Max Credits Per Semester"
                            onChangeText={setMaxCreditPerSemester}
                            value={maxCreditPerSemester}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Min Credits Per Semester"
                        onChangeText={setMinCreditPerSemester}
                        value={minCreditPerSemester}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <PaperButton
                            mode="contained"
                            style={styles.button}
                            onPress={handleRegister}
                            color="#7E57C2"
                            labelStyle={styles.buttonText}
                        >
                            Register
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
        // </ScrollView>
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
        fontSize: 22,
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

export default NewProgramRegistrationScreen;
