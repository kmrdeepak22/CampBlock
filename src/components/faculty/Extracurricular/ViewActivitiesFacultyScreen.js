import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../../UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';
const ViewActivitiesFacultyScreen = ({ facultyID }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedActivityID, setExpandedActivityID] = useState(null);
    const { userData} = useContext(UserContext); 

    const navigation = useNavigation();
    useEffect(() => {
        fetchActivitiesByFaculty();
    }, []);

    const fetchActivitiesByFaculty = async () => {
        try {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const functionName = 'GetExtracurricularActivitiesByFacultyID';
            const facultyID = userData.facultyID;
            const apiURL = `${baseURL}/GetCoursesByFacultyID?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${facultyID}`;

            const response = await axios.get(apiURL);
            console.log('GetExtracurricularActivitiesByFacultyID response:', response.data);
            setActivities(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching activities by faculty:', error);
            setIsLoading(false);
        }
    };

    const renderActivityItem = ({ item }) => {
        const { activityID, name, description, location, date, maxCount, facultyID } = item;
        const isExpanded = expandedActivityID === activityID;

        // Extract day, month, and year from the date string
        const day = item.date.substring(0, 2);
        const month = item.date.substring(2, 4);
        const year = item.date.substring(4);

        // Convert month number to month name
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(month, 10) - 1];
        // Format the date
        const formattedDate = `${monthName} ${parseInt(day, 10)}, ${year}`;

        // Render the expanded section with additional details
        const renderExpandedSection = () => (
            <View style={styles.additionalDetails}>
                <Text>Max Seats: {maxCount}</Text>
                <Text>Faculty ID: {facultyID}</Text>
                <Text>Location: {location}</Text>
                <Text>Date: {formattedDate}</Text>
                <Text>Description: {description}</Text>
            </View>
        );

        return (
            <TouchableOpacity
                style={styles.courseItem}
                onPress={() => setExpandedActivityID(isExpanded ? null : activityID)}
            >
                <Text style={styles.courseName}>{name}</Text>
                <Text style={styles.courseID}>Activity ID: {activityID}</Text>
                {isExpanded && renderExpandedSection()}
                {isExpanded && (
                        <TouchableOpacity
                            style={styles.viewEnrolledButton}
                        onPress={() => handleViewRegisteredStudents(activityID)} // Pass a function reference
                        >
                            <Text style={styles.viewEnrolledButtonText}>View Registered Students</Text>
                        </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const handleViewRegisteredStudents = (activityID) => {
        // Navigate to a screen to display enrolled students (use navigation library)
        console.log('Navigating to view registered students for activity:', activityID);
        navigation.navigate('ViewRegisteredStudents', { activityID });
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
                data={activities}
                keyExtractor={(item) => item.activityID}
                renderItem={renderActivityItem}
            />
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('FacultyDashboard')}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={40} color="#4CAF50" />
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
        backgroundColor: '#4CAF50',
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
        color: 'black',
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

export default ViewActivitiesFacultyScreen;
