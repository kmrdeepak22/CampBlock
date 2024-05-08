import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import axios from 'axios'; // Import axios
import { Dropdown } from 'react-native-element-dropdown';

const NewFacultyRegistrationScreen = ({ navigation }) => {
//    facultyID string, facultyName string, departmentID string
    const [facultyID, setFacultyID] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [error, setError] = useState('');

    const [dept, setDept] = useState(null);
    const [deptList, setDeptList] = useState([]);


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



    const handleRegister = async () => {
    if (!dept || !facultyID || !facultyName) {
            setError('Please fill out all fields.');
            return;
        }

        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddFaculty';


        const formData = new URLSearchParams();
        formData.append("args", facultyID.toUpperCase());
        formData.append("args", facultyName);
        formData.append("args", dept);
        // formData.append("args", JSON.stringify(coursesToAdd));


        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('AddFaculty response:', response.data);
            Alert.alert(`Added ${facultyID} into Faculty List`);
            setError('Successfully Registered.');
            return;
            // Handle success (if needed)
        } catch (error) {
            // console.error('Error Registering Faculty:', error);
            Alert.alert('Error', 'Failed to Add');
            setError('Error Registering Faculty.');
            return;
            // Handle error (if needed)
            // throw new Error('Registration failed');
        }

        // Clear form fields after registration
        // setRollNo('');
        // setName('');
        // setProgram('');
        // setDepartment('');

    };

    return (
        // <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Card elevation={5} style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Faculty to be added...</Title>

                    <TextInput
                        style={styles.input}
                        placeholder="FacultyID"
                        onChangeText={setFacultyID}
                        value={facultyID}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Faculty Name"
                        onChangeText={setFacultyName}
                        value={facultyName}
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
                    </Card.Content>
            </Card>
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
        // </ScrollView>
    );
};

const styles = StyleSheet.create({
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

export default NewFacultyRegistrationScreen;
