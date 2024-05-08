import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import axios from 'axios';
import UserContext from '.././UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const StudentViewProfileScreen = ({ route }) => {
    const { userData } = useContext(UserContext);
    const [studentProfile, setStudentProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetEnrollment';
    const args = userData.rollNo;
    const apiURL = `${baseURL}/GetEnrollment?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${args}`;

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await axios.get(apiURL);
                console.log('getEnrollment response:', response)
                setStudentProfile(response.data);
                setIsLoading(false);
            } catch (error) {
                // console.error('Error fetching student profile:', error);
                setIsLoading(false);
            }
        };

        fetchStudentProfile();
    }, [apiURL]);


    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7E57C2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                {studentProfile ? (
                    <>
                        <Section title="Basic Information">
                            <Property label="Student ID" value={studentProfile.studentID} />
                            <Property label="Name" value={studentProfile.name} />
                            <Property label="Program" value={studentProfile.programType} />
                            <Property label="Department" value={studentProfile.department} />
                        </Section>
                        <Section title="Progress Information">
                            <Property label="Current Semester" value={studentProfile.currentSemester} />
                            <Property label="Credits Completed" value={studentProfile.creditsCompleted} />
                        </Section>
                    </>
                ) : (
                    <Text style={styles.errorText}>No profile data available.</Text>
                )}
            </View>
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('StudentDashboard')}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={40} color="#7E57C2" />
                        </>
                    )}
                />

            </View>
        </View>
    );
};

const Section = ({ title, children }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
};

const Property = ({ label, value }) => {
    return (
        <View style={styles.propertyContainer}>
            <Text style={styles.label}>{label}: </Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    section: {
        marginBottom: 10,
        marginTop: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#7E57C2',
        backgroundColor: '#E0E0E0',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#7E57C2',
    },
    propertyContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    value: {
        fontSize: 16,
        color: '#333333',
    },
    errorText: {
        fontSize: 16,
        color: '#FF0000',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        zIndex: 1, // Ensure button appears above other elements
    },
    bottomBar: {
        // position: 'absolute',
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

export default StudentViewProfileScreen;
