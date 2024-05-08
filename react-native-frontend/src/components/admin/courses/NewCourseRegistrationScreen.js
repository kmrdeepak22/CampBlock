import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'; // Import axios for API requests
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
const NewCourseRegistrationScreen = ({ navigation }) => {
    const [value, setValue] = useState(null);
    const [facultyList, setFacultyList] = useState([]);

    const [dept, setDept] = useState(null);
    const [deptList, setDeptList] = useState([]);


        // courseID string, courseName string, credits int, departmentID string, facultyID string, description string, academicYear int, semester int
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName] = useState('');
    const [credits, setCredits] = useState('');
    const [description, setDescription] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [semester, setSemester] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        // Fetch faculty IDs from API
        const fetchDepartmentsIDs = async () => {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllDepartments';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const functionName = 'GetAllDepartments';
            const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;
            try {
                const response = await axios.get(apiURL);
                // Assuming the response is an array of faculty objects with 'facultyID' field
                const deptIDs = response.data.map(dept => ({
                    label: dept.departmentID,
                    value: dept.departmentID,
                })); { error ? <Text style={styles.errorText}>{error}</Text> : null }

                setDeptList(deptIDs);
            } catch (error) {
                // console.error('Error fetching department IDs:', error);
            }
        };

        fetchDepartmentsIDs();
    }, []);





    useEffect(() => {
        // Fetch faculty IDs from API
        const fetchFacultyIDs = async () => {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllFaculties';
        const chaincodeid = 'basic';
        const channelid = 'mychannel';
        const functionName = 'GetAllFaculties';
        const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;
            try {
                const response = await axios.get(apiURL);
                // Assuming the response is an array of faculty objects with 'facultyID' field
                const facultyIDs = response.data.map(faculty => ({
                    label: faculty.facultyID,
                    value: faculty.facultyID,
                }));
                setFacultyList(facultyIDs);
            } catch (error) {
                // console.error('Error fetching faculty IDs:', error);
            }
        };

        fetchFacultyIDs();
    }, []);


    const handleRegister = async () => {
        if (!courseID || !courseName || !credits || !dept || !value || !description || !academicYear || !semester) {
            setError('Please fill out all fields.');
            return;
        }
        
        // Check if courseID follows the format: DepartmentID + 4-digit number
        const courseIDPattern = new RegExp(`^${dept.toUpperCase()}\\d{4}$`);
        if (!courseID.match(courseIDPattern)) {
            setError('Course ID should follow the format: DepartmentID + 4-digit number.');
            return;
        }

        // Credits should be an integer
        if (isNaN(parseInt(credits))) {
            setError('Credits should be a valid integer.');
            return;
        }

        // Academic Year should be a valid year
        const currentYear = new Date().getFullYear();
        if (isNaN(parseInt(academicYear)) || academicYear < currentYear - 10 || academicYear > currentYear + 10) {
            setError('Academic Year should be a valid year.');
            return;
        }

        // Semester should be an integer and either 1 or 2
        if (isNaN(parseInt(semester)) || ![1, 2].includes(parseInt(semester))) {
            setError('Semester should be an integer and either 1 or 2 only.');
            return;
        }


        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddCourse';

        // const dataToAdd = [courseID.toUpperCase(), courseName, credits, departmentID.toUpperCase(), facultyID, description, academicYear, semester];

        const formData = new URLSearchParams();
        formData.append("args", courseID.toUpperCase());
        formData.append("args", courseName);
        formData.append("args", credits);
        formData.append("args", dept);
        formData.append("args", value);
        formData.append("args", description);
        formData.append("args", academicYear);
        formData.append("args", semester);
        // formData.append("args", JSON.stringify(coursesToAdd));


        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('AddCourse response:', response.data);
            Alert.alert(`Added ${courseID} into Course List`);
            setError('Successfully Registered.');
            // return;
            // Handle success (if needed)
            // Clear form fields after registration
            setCourseID('');
            setCourseName('');
            setCredits('');
            setDept('');
            setValue('');
            setDescription('');
            setAcademicYear('');
            setSemester('');
        } catch (error) {
            // console.error('Error Registering Course:', error);
            Alert.alert('Failed to Add', 'Either already exist or mismatch in data provided(faculty is from other department).');
            setError('Error Registering Course.');
            return;
            // Handle error (if needed)
            // throw new Error('Registration failed');
        }

        // // Clear form fields after registration
        // setValue('');
        // setDept('');
        // setCourseID('');
        // setCourseName('');
        // setCredits('');
        // setDescription('');
        // setAcademicYear('');
        // setSemester('');
  

    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Card elevation={5} style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Course to be added...</Title>

                    <TextInput
                        style={styles.input}
                        placeholder="CourseID"
                        onChangeText={setCourseID}
                        value={courseID}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Course Name"
                        onChangeText={setCourseName}
                        value={courseName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Credits"
                        onChangeText={setCredits}
                        value={credits}
                    />
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Department ID"
                        onChangeText={setDepartmentID}
                        value={departmentID}
                    /> */}
                        <Dropdown
                            style={styles.input}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={deptList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select department"
                            searchPlaceholder="Search..."
                            value={dept}
                            onChange={item => {
                                setDept(item.value);
                            }}
                        />

                <Dropdown
                    style={styles.input}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={facultyList}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select faculty"
                    searchPlaceholder="Search..."
                    value={value}
                    onChange={item => {
                        setValue(item.value);
                    }}
                />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        onChangeText={setDescription}
                        value={description}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Academic Year"
                        onChangeText={setAcademicYear}
                        value={academicYear}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Semester"
                        onChangeText={setSemester}
                        value={semester}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <PaperButton
                            mode="contained"
                            style={styles.button}
                            onPress={handleRegister}
                            color="#7E57C2"
                            labelStyle={styles.buttonText}
                        >
                            Register
                        </PaperButton>
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                        <TextInput
                            style={""}
                            placeholder=""
                            onChangeText={setSemester}
                            value={""}
                        />
                    </Card.Content>
                </Card>
            </ScrollView>

                <View style={styles.bottomBar}>
                    <PaperButton
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

export default NewCourseRegistrationScreen;

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    dropdownContainer: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        zIndex: 9999, // Ensure the dropdown list appears above other elements
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropdownList: {
        backgroundColor: '#fafafa',
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Light background color
        // paddingBottom: 40,
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
        fontSize: 22,
    },
    input: {
        height: 40,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        marginVertical: 5,
        borderRadius: 8,
        paddingVertical: 5,
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
    },
    bottomBarText: {
        color: '#7E57C2', // Blue text color
        marginTop: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});






