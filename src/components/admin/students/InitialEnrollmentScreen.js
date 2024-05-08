import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Dropdown } from 'react-native-element-dropdown';

const NewEnrollmentScreen = ({ navigation }) => {
    const [rollNo, setRollNo] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const [dept, setDept] = useState(null);
    const [deptList, setDeptList] = useState([]);


    const [prg, setPrg] = useState(null);
    const [prgList, setPrgList] = useState([]);

    useEffect(() => {
        // Fetch faculty IDs from API
        const fetchProgramsIDs = async () => {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllPrograms';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const functionName = 'GetAllPrograms';
            const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;
            try {
                const response = await axios.get(apiURL);
                // Assuming the response is an array of faculty objects with 'facultyID' field
                const prgIDs = response.data.map(prg => ({
                    label: prg.name,
                    value: prg.name,
                })); { error ? <Text style={styles.errorText}>{error}</Text> : null }

                setPrgList(prgIDs);
            } catch (error) {
                // console.error('Error fetching program IDs:', error);
            }
        };

        fetchProgramsIDs();
    }, []);




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
        if (!rollNo || !name || !prg || !dept) {
            setError('Please fill out all fields.');
            return;
        }


        const rollNoRegex = new RegExp(`^${dept.slice(0, 2)}\\d{2}${prg.charAt(0)}\\d{3}$`);


        if (!rollNo.match(rollNoRegex)) {
            setError('Invalid roll number. (Valid Format: CS22M037)');
            return;
        }

        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/InitialEnrollment';
        const chaincodeid = 'basic';
        const channelid = 'mychannel';
        const functionName = 'InitialEnrollment';
        const args = [rollNo.toUpperCase(), name.toUpperCase(), prg, dept];
        const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${args}`;

        try {
            const response = await axios.post(apiURL);
            console.log('Registration response:', response.data);
            Alert.alert(`Enrolled student ID: ${rollNo} into first semester`);
            setError('Successfully Enrolled.');
            return
        } catch (error) {
            // console.error('Error Enrolling student:', error);
            Alert.alert('Error', 'Failed to enroll student into the first semester.');
            setError('Error Enrolling student.');
            return
        }

        // Clear form fields after registration (if needed)
        // setRollNo('');
        // setName('');
        // setProgram('');
        // setDepartment('');
    };

    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Student to be added...</Title>
                    <TextInput
                        style={styles.input}
                        placeholder="Roll No"
                        onChangeText={setRollNo}
                        value={rollNo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        onChangeText={setName}
                        value={name}
                    />
                    <Dropdown
                        style={styles.input}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={prgList}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Program"
                        searchPlaceholder="Search..."
                        value={prg}
                        onChange={item => {
                            setPrg(item.value);
                        }}
                    />
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
        fontSize: 24,
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

export default NewEnrollmentScreen;
