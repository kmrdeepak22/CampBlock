import React, { useContext, useState, useEffect } from 'react';
import UserContext from '.././UserContext'; // Import the user context
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

// const studentID = 'CS22M037'; // Replace with actual student ID
const StudentCurrentSemesterScreen = ({ route }) => {
    const { userData } = useContext(UserContext); // Access userData and setUserData from context    // Extract the rollNo from the route parameters

    const navigation = useNavigation();
    // const { rollNo } = userData.rollNo;
    console.log('rollNo at viewCurrSem:', userData.rollNo);
    const [studentProfile, setStudentProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    // Define the API endpoint and parameters
    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetEnrollment'; // Replace with your API base URL
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetEnrollment';
    const args = userData.rollNo;


    // Construct the complete URL with query parameters
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${args}`;

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await axios.get(apiURL);
                console.log('API Response at viewCurrSem:', response.data); // Log the API response data
                setStudentProfile(response.data);
                setIsLoading(false);
            } catch (error) {
                // console.error('Error fetching student profile:', error);
                // Handle error (e.g., show error message)
                setIsLoading(false);
            }
        };

        fetchStudentProfile();
    }, [apiURL]);



    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{studentProfile.currentSemester}</Text>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('StudentViewCoursesCurrSem')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        View Courses
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('StudentAddCourse')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Add Course
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('StudentDropCourse')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Drop Course
                    </Button>
                </Card.Content>
            </Card>
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('StudentAcademicDashboard')}
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
        fontSize: 30,
    },
    button: {
        marginVertical: 12,
        borderRadius: 8,
        paddingVertical: 7,
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
        // borderColor: '#7E57C2',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        // width: '50%',
    },
    bottomBarText: {
        color: '#7E57C2', // Blue text color
        marginTop: 4,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StudentCurrentSemesterScreen;





