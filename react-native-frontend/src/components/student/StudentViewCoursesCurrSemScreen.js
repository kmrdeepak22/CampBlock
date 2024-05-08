import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import UserContext from '../UserContext'; // Import the user context
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library


const StudentViewCoursesCurrSemScreen = () => {
    const { userData } = useContext(UserContext);
    const [coursesTaken, setCoursesTaken] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const getEnrollmentFunction = 'GetEnrollment';
    const getCourseFunction = 'GetCourse';
    const args = userData.rollNo;
    const apiURL = `${baseURL}/${getEnrollmentFunction}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getEnrollmentFunction}&args=${args}`;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(apiURL);
                console.log('apiURL1 Response:', response.data);
                const currentSemester = response.data.currentSemester;
                const courses = response.data.coursesTaken[currentSemester] || [];
                setCoursesTaken(courses);
                setIsLoading(false);
            } catch (error) {
                // console.error('Error fetching courses:', error);
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [apiURL]);


    
    const fetchCourseInfo = async (courseID) => {
        const apiCourseURL = `${baseURL}/${getCourseFunction}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getCourseFunction}&args=${courseID}`;
        try {
            const response = await axios.get(apiCourseURL);
            console.log('apiURL2 Response:', response.data);
            console.log('API Response for course info:', response.data);
            return response.data;
        } catch (error) {
            // console.error(`Error fetching course ${courseID} info:`, error);
            return null;
        }
    };

    const handleCoursePress = async (courseID) => {
        try {
            const courseInfo = await fetchCourseInfo(courseID);
            setExpandedCourse(courseInfo);
        } catch (error) {
            // console.error(`Error fetching course ${courseID} details:`, error);
            setExpandedCourse(null);
        }
    };

    const sortCoursesByCourseID = () => {
        const sortedCourses = [...courses].sort((a, b) => {
            const comparison = a.courseID.localeCompare(b.courseID);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setCourses(sortedCourses);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };


    const renderCourseItem = ({ item }) => {

        const getAcademicYear = (semester) => {
            if (semester === 1) {
                return 'JAN-MAY';
            } else if (semester === 2) {
                return 'JULY-NOV';
            }
            return '';
        };


        console.log("item: ", item);
        const { courseID } = item;
        // const isExpanded = expandedCourse.includes(courseID);
        // console.log("isExpanded: ", isExpanded);
        console.log('expandedCourse:', expandedCourse)

        const renderExpandedSection = () => (
            <View style={styles.additionalDetails}>
                <Text>Course Name: {expandedCourse.name}</Text>
                <Text>Credits: {expandedCourse.credits}</Text>
                <Text>Department ID: {expandedCourse.department}</Text>
                <Text>Faculty ID: {expandedCourse.facultyID}</Text>
                <Text>Academic Year: {expandedCourse.academicYear}, {getAcademicYear(expandedCourse.semester)}</Text>
                <Text>Description: {expandedCourse.description}</Text>
            </View>
        );


        return (
            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress(item)}>
                {/* <Text style={styles.courseName}>{expandedCourse?.name}</Text> */}
                <Text style={styles.courseID}>Course ID: {item}</Text>
                {expandedCourse && expandedCourse.courseID === item && renderExpandedSection()}
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={coursesTaken}
                keyExtractor={(item) => item}
                renderItem={renderCourseItem}
            />
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('StudentCurrentSemester')}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sortButton: {
        backgroundColor: '#7E57C2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sortButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
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
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    addButtonText: {
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

export default StudentViewCoursesCurrSemScreen;

