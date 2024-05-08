import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ExistingCoursesScreen = ({ navigation }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCourseName, setExpandedCourseName] = useState(null); // Track expanded program
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllCourses';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllCourses';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchCourses = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('GetAllCourses response:', response.data);
            setCourses(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching courses:', error);
            setIsLoading(false);
        }
    };


    const toggleExpand = (courseName) => {
        if (expandedCourseName === courseName) {
            // Collapse the currently expanded Course
            setExpandedCourseName(null);
        } else {
            // Expand the clicked course and collapse the previously expanded one
            setExpandedCourseName(courseName);
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
        const { courseID, name, credits, department, facultyID, description, academicYear, semester } = item;

        const isExpanded = expandedCourseName === name;

        // Filter courses based on search query
        const normalizedCourseName = name ? name.toLowerCase() : '';
        const normalizedDepartmentID = department ? department.toLowerCase() : '';
        if (!normalizedCourseName.includes(searchQuery.toLowerCase()) && !normalizedDepartmentID.includes(searchQuery.toLowerCase())) {
            return null;
        }
        const getAcademicYear = (semester) => {
            if (semester === 1) {
                return 'JAN-MAY';
            } else if (semester === 2) {
                return 'JULY-NOV';
            }
            return '';
        };

        return (
            <TouchableOpacity style={styles.courseItem} onPress={() => toggleExpand(name)}>
                <Text style={styles.courseName}>{name}</Text>
                <Text style={styles.courseID}>Course ID: {courseID}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Credits: {credits}</Text>
                        <Text>Department ID: {department}</Text>
                        <Text>Faculty ID: {facultyID}</Text>
                        <Text>Academic Year: {academicYear}, {getAcademicYear(semester)}</Text>
                        <Text>Description: {description}</Text>
                    </View>
                )}
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.viewEnrolledButton}
                        onPress={() => handleRemoveCourse(courseID)} // Pass a function reference
                    >
                        <Text style={styles.viewEnrolledButtonText}>Remove Course</Text>
                    </TouchableOpacity>
                )}
                
            </TouchableOpacity>
        );
    };


    const handleRemoveCourse = async (courseID) => {
        // Navigate to a screen to display enrolled students (use navigation library)
        // console.log('Navigating to view enrolled students for course:', courseID);
        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/RemoveCourse';
        const formData = new URLSearchParams();
        formData.append("args", courseID.toUpperCase());
        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('RemoveCourse response:', response.data);
            Alert.alert(`Removed ${courseID} from Course List`);
            setError('Successfully Removed.');

        } catch (error) {
            // console.error('Error Removing Course:', error);
            Alert.alert('Error', 'Failed to Remove');
            setError('Error Removing Course.');
            return;
        }
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
                    placeholder="Search by course name or ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortCoursesByCourseID}>
                    <Text style={styles.sortButtonText}>Sort by Course ID ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.courseID}
                renderItem={renderCourseItem}
            />
            <View style={styles.bottomBar}>
                <Button
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
    },
    bottomBarText: {
        color: '#7E57C2', // Blue text color
        marginTop: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExistingCoursesScreen;
