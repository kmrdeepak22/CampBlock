import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import UserContext from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const StudentPreviousSemesterScreen = () => {
    const { userData } = useContext(UserContext);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null); // Track expanded course
    const [courses, setCourses] = useState({}); // State to hold course info
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchEnrollmentData(userData.rollNo);
    }, [userData.rollNo]);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const getEnrollmentFunction = 'GetEnrollment';
    const getCourseFunction = 'GetCourse';

    const fetchEnrollmentData = async (rollNo) => {
        try {
            const apiURL = `${baseURL}/GetEnrollment?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getEnrollmentFunction}&args=${rollNo}`;
            const response = await axios.get(apiURL);
            console.log('Enrollment data response:', response.data);

            if (response.data && typeof response.data.coursesTaken === 'object') {
                const { coursesTaken, currentSemester } = response.data;
                const coursesBeforeCurrentSemester = [];

                Object.keys(coursesTaken).forEach((semester) => {
                    if (semester !== currentSemester) {
                        coursesBeforeCurrentSemester.push(...coursesTaken[semester]);
                    }
                });

                setEnrollmentData(coursesBeforeCurrentSemester);
            } else {
                // console.error('Invalid coursesTaken data:', response.data);
            }
        } catch (error) {
            // console.error('Error fetching enrollment data:', error);
        }
    };

    const fetchCourseInfo = async (courseID) => {
        try {
            const apiURL = `${baseURL}/GetCourse?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getCourseFunction}&args=${courseID}`;
            const response = await axios.get(apiURL);
            if (response.data) {
                setCourses({ ...courses, [courseID]: response.data });
                console.log('Course info:', response.data);
            }
        } catch (error) {
            // console.error('Error fetching course info:', error);
        }
    };

    const toggleExpand = async (courseID) => {
        if (expandedCourse === courseID) {
            setExpandedCourse(null);
        } else {
            setExpandedCourse(courseID);
            await fetchCourseInfo(courseID);
        }
    };

    const renderCourseItem = ({ item }) => {
        const courseID = item;

        const isExpanded = expandedCourse === courseID;
        const courseInfo = courses[courseID];

        return (
            <TouchableOpacity style={styles.courseItem} onPress={() => toggleExpand(courseID)}>
                <Text style={styles.courseName}>{courseID}</Text>
                <Text style={styles.courseName}>{courseInfo?.name}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Credits: {courseInfo?.credits}</Text>
                        <Text>Department ID: {courseInfo?.department}</Text>
                        <Text>Faculty ID: {courseInfo?.facultyID}</Text>
                        <Text>Description: {courseInfo?.description}</Text>
                        <Text>Academic Year: {courseInfo?.academicYear}</Text>
                        <Text>Semester: {courseInfo?.semester}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };
    
    const renderSemesterCourses = () => {
        return (
            <FlatList
                data={enrollmentData}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.courseList}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by course ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
            </View>
            {renderSemesterCourses()}
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
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    courseList: {
        marginTop: 10,
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
    additionalDetails: {
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

export default StudentPreviousSemesterScreen;


