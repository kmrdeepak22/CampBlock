import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ManageStudentsScreen = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedStudentName, setExpandedStudentName] = useState(null); // Track expanded program

    useEffect(() => {
        fetchStudents();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllEnrollments';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllEnrollments';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiURL);
            setStudents(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching students:', error);
            setIsLoading(false);
        }
    };

    const toggleExpand = (studentName) => {
        if (expandedStudentName === studentName) {
            // Collapse the currently expanded student
            setExpandedStudentName(null);
        } else {
            // Expand the clicked student and collapse the previously expanded one
            setExpandedStudentName(studentName);
        }
    };

    const sortStudentsByRollNo = () => {
        const sortedStudents = [...students].sort((a, b) => {
            const comparison = a.studentID.localeCompare(b.studentID);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setStudents(sortedStudents);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderStudentItem = ({ item }) => {
        const { name, studentID, programType, department, currentSemester, creditsCompleted, creditsThisSemester } = item;

        const isExpanded = expandedStudentName === name;

        const handleEnroll = async (studentID) => {
            const baseURL1 = 'https://measured-wasp-terminally.ngrok-free.app/EnrollStudentIntoNextSemester';
            const formData = new URLSearchParams();
            formData.append("args", studentID);
            try {
                const response = await axios.post(baseURL1, formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                console.log('EnrollStudentIntoNextSemester response:', response.data);
                fetchStudents;
                Alert.alert(`Enrolled student ID: ${studentID} into the next semester`);
            } catch (error) {
                // console.error('Error enrolling student:', error);
                Alert.alert('Failed to enroll into the next semester', 'Either result is pending for some of the courses or minimun Credits not taken this semester.');
            }
        };

        // Render the expanded section with additional details
        const renderExpandedSection = () => (
            <View style={styles.additionalDetails}>
                <Text>Program: {programType}</Text>
                <Text>Department: {department}</Text>
                <Text>Current Semester: {currentSemester}</Text>
                <Text>Credits Completed: {creditsCompleted}</Text>
                <Text>Credits taken in current semester: {creditsThisSemester}</Text>
            </View>
        );

        // Filter students based on search query
        if (
            !name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !studentID.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return null;
        }


        return (
            <TouchableOpacity style={styles.studentItem} onPress={() => toggleExpand(name)}>
                <Text style={styles.studentName}>{name}</Text>
                <Text style={styles.studentID}>Roll No: {studentID}</Text>
                {isExpanded && renderExpandedSection()}
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.enrollButton}
                        onPress={() => handleEnroll(studentID)}
                    >
                        <Text style={styles.enrollButtonText}>Enroll into Next Semester</Text>
                    </TouchableOpacity>
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
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortStudentsByRollNo}>
                    <Text style={styles.sortButtonText}>Sort by Roll No ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={students}
                keyExtractor={(item) => item.studentID}
                renderItem={renderStudentItem}
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
    studentItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    studentName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    studentID: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    additionalDetails: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
    },
    enrollButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    enrollButtonText: {
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

export default ManageStudentsScreen;



