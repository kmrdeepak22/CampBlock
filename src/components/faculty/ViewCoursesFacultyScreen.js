import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ViewCoursesFacultyScreen = ({ facultyID }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCourseID, setExpandedCourseID] = useState(null);
    const { userData} = useContext(UserContext); 

    const navigation = useNavigation();
    useEffect(() => {
        fetchCoursesByFaculty();
    }, []);

    const fetchCoursesByFaculty = async () => {
        try {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const functionName = 'GetCoursesByFacultyID';
            const facultyID = userData.facultyID;
            const apiURL = `${baseURL}/GetCoursesByFacultyID?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${facultyID}`;

            const response = await axios.get(apiURL);
            console.log('GetCoursesByFacultyID response:', response.data);
            setCourses(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching courses by faculty:', error);
            setIsLoading(false);
        }
    };

    const renderCourseItem = ({ item }) => {
        const { courseID, name, credits, department, description, academicYear, semester } = item;
        const isExpanded = expandedCourseID === courseID;


        // Render the expanded section with additional details
        const renderExpandedSection = () => (
            <View style={styles.additionalDetails}>
                <Text>Credits: {credits}</Text>
                <Text>Department: {department}</Text>
                <Text>Academic Year: {academicYear}</Text>
                <Text>Description: {description}</Text>
            </View>
        );

        return (
            <TouchableOpacity
                style={styles.courseItem}
                onPress={() => setExpandedCourseID(isExpanded ? null : courseID)}
            >
                <Text style={styles.courseName}>{name}</Text>
                <Text style={styles.courseID}>Course ID: {courseID}</Text>
                {isExpanded && renderExpandedSection()}
                {isExpanded && (
                        <TouchableOpacity
                            style={styles.viewEnrolledButton}
                        onPress={() => handleViewEnrolledStudents(courseID)} // Pass a function reference
                        >
                            <Text style={styles.viewEnrolledButtonText}>View Enrolled Students</Text>
                        </TouchableOpacity>
                )}
            </TouchableOpacity>
            
        );
    };

    const handleViewEnrolledStudents = (courseID) => {
        // Navigate to a screen to display enrolled students (use navigation library)
        console.log('Navigating to view enrolled students for course:', courseID);
        navigation.navigate('ViewEnrolledStudents', { courseID });
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7E57C2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.courseID}
                renderItem={renderCourseItem}
            />
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('FacultyDashboard')}
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
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    courseItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    courseName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    courseID: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    additionalDetails: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    viewEnrolledButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    viewEnrolledButtonText: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
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

export default ViewCoursesFacultyScreen;
