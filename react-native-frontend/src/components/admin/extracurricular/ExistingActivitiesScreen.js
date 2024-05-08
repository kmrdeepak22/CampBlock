import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { Button, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const ExistingActivitiesScreen = ({navigation }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedActivityName, setExpandedActivityName] = useState(null); // Track expanded program
    const [date, setDate] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllExtracurricularActivities';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllExtracurricularActivities';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchCourses = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('GetAllExtracurricularActivities response:', response.data);
            setActivities(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching Activities:', error);
            setIsLoading(false);
        }
    };


    const toggleExpand = (activityName) => {
        if (expandedActivityName === activityName) {
            // Collapse the currently expanded activity
            setExpandedActivityName(null);
        } else {
            // Expand the clicked activity and collapse the previously expanded one
            setExpandedActivityName(activityName);
        }
    };

    const sortActivitiesByActivityID = () => {
        const sortedActivities = [...activities].sort((a, b) => {
            const comparison = a.activityID.localeCompare(b.activityID);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setActivities(sortedActivities);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderActivityItem = ({ item }) => {
        const { activityID, name, description, location, date, maxCount, facultyID } = item;


        // Extract day, month, and year from the date string
        const day = item.date?.substring(0, 2);
        const month = item.date?.substring(2, 4);
        const year = item.date?.substring(4);

        // Convert month number to month name
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(month, 10) - 1];
        // Format the date
        const formattedDate = `${monthName} ${parseInt(day, 10)}, ${year}`;


        const isExpanded = expandedActivityName === name;

        // Filter activities based on search query
        const normalizedActivityName = name ? name.toLowerCase() : '';
        const normalizedFacultyID = facultyID ? facultyID.toLowerCase() : '';
        if (!normalizedActivityName.includes(searchQuery.toLowerCase()) && !normalizedFacultyID.includes(searchQuery.toLowerCase())) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.activityItem} onPress={() => toggleExpand(name)}>
                <Text style={styles.activityName}>{name}</Text>
                <Text style={styles.activityID}>Activity ID: {activityID}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Max Seats: {maxCount}</Text>
                        <Text>Faculty ID: {facultyID}</Text>
                        <Text>Location: {location}</Text>
                        <Text>Date: {formattedDate}</Text>
                        <Text>Description: {description}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };




    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by activity name or ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortActivitiesByActivityID}>
                    <Text style={styles.sortButtonText}>Sort by Activity ID ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={activities}
                keyExtractor={(item) => item?.activityID}
                renderItem={renderActivityItem}
            />
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.goBack()}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#4CAF50',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sortButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sortButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activityItem: {
        backgroundColor: '#4CAF50',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    activityName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    activityID: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    additionalDetails: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
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

export default ExistingActivitiesScreen;
