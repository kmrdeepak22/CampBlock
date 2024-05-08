import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

import CustomPicker from '../CustomPicker';

const ViewEnrolledStudentsScreen = ({ route }) => {
    const navigation = useNavigation();

    const { courseID } = route.params;
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);
    const [successMap, setSuccessMap] = useState({});
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        fetchEnrolledStudents();
    }, []);

    const fetchEnrolledStudents = async () => {
        try {
            // Fetch enrolled students and their details
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const getStudentsFunction = 'GetStudentsByCourseIDInCoursesTaken';
            const getEnrollmentFunction = 'GetEnrollment';

            const studentIDsResponse = await axios.get(
                `${baseURL}/${getStudentsFunction}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getStudentsFunction}&args=${courseID}`
            );
            const enrolledStudentIDs = studentIDsResponse.data || [];

            const enrolledStudentsDetails = await Promise.all(
                enrolledStudentIDs.map(async (studentID) => {
                    const studentDetailsResponse = await axios.get(
                        `${baseURL}/${getEnrollmentFunction}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getEnrollmentFunction}&args=${studentID}`
                    );
                    return {
                        studentID,
                        ...studentDetailsResponse.data,
                        isExpanded: false,
                    };
                })
            );

            setStudents(enrolledStudentsDetails);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching enrolled students:', error);
            setIsLoading(false);
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
        const { studentID, name, programType, department, currentSemester, isExpanded } = item;

        const isMatched = name.toLowerCase().includes(searchQuery.toLowerCase()) || studentID.toLowerCase().includes(searchQuery.toLowerCase()) || department.toLowerCase().includes(searchQuery.toLowerCase()) || programType.toLowerCase().includes(searchQuery.toLowerCase());

        if (!isMatched) {
            return null;
        }

        
        const toggleExpand = () => {
            // { setError('') }
            const updatedStudents = students.map((student) =>
                student.studentID === studentID ? { ...student, isExpanded: !student.isExpanded } : student
            );
            setStudents(updatedStudents);
        };

        const handleAddGrade = async (studentID, courseID) => {
            if (!selectedGrade) {
                // Show a warning or alert message indicating that a grade must be selected
                setError('Please select a grade before adding.');
                Alert.alert('Please select a grade before adding.');
                return;
            }

            if (successMap[studentID]) {
                Alert.alert('Grade already added for this student.');
                return;
            }

            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddResultForCurrentSemester';
            console.log("courseID isnide handleAddGrade: ", courseID);
            console.log("selectedGrade isnide handleAddGrade: ", selectedGrade);
            const grade = selectedGrade;
            const resultToAdd = [
                {
                    courseID, grade,
                }
            ];

            const formData = new URLSearchParams();
            formData.append("args", studentID);
            formData.append("args", JSON.stringify(resultToAdd));

            try {

                const response = await axios.post(baseURL, formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });

                console.log('Grade added successfully:', response.data);
                // Optionally show an alert or update UI upon successful addition of grade
                Alert.alert('Grade added successfully.');

            } catch (error) {
                // console.error('Error adding grade:', error);
                Alert.alert('Failed to add grade', 'Already added!');
            }
        };




        


        return (
            <TouchableOpacity style={styles.studentItem} onPress={toggleExpand}>
                <Text style={styles.studentName}>{name}</Text>
                <Text style={styles.studentID}>Roll No: {studentID}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Program: {programType}</Text>
                        <Text>Department: {department}</Text>
                        <Text>Current Semester: {currentSemester}</Text>
                    </View>
                )}
                {isExpanded && (
                    <View style={styles.gradeContainer}>
                        <TextInput
                            style={styles.gradeInput}
                            placeholder="Selected Grade"
                            value={selectedGrade}
                            editable={false}
                        />
                        </View>
                )}
                {isExpanded && (
                        <TouchableOpacity
                            style={styles.addGradeButton}
                        onPress={() => setIsCustomPickerVisible(true)}
                        disabled={successMap[studentID]}
                        >
                            <Text style={styles.addGradeButtonText}>Choose Grade</Text>
                        </TouchableOpacity>
                )}
                {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
                {isExpanded && (
                        <TouchableOpacity
                            style={styles.addGradeButton}
                        onPress={() => handleAddGrade(studentID, courseID)}
                        disabled={successMap[studentID]}
                        >
                            <Text style={styles.addGradeButtonText}>Add Grade</Text>
                        </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, ID, program, or department..."
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
            {/* Render the CustomPicker component */}
            <CustomPicker
                isVisible={isCustomPickerVisible}
                options={['S', 'A', 'B', 'C', 'D', 'E', 'F']}
                onSelect={(grade) => {
                    setSelectedGrade(grade);
                    setIsCustomPickerVisible(false);
                }}
            />
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('ViewCoursesFaculty')}
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
    studentID: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    studentName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    additionalDetails: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    gradeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    gradeInput: {
        flex: 1,
        height: 35,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'left'
    },
    addGradeButton: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
    
    },
    addGradeButtonText: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        backgroundColor:'white',
        color: 'red',
        marginTop: 13,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
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

export default ViewEnrolledStudentsScreen;

