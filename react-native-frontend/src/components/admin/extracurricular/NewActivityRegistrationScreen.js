import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button as PaperButton } from 'react-native-paper';

import axios from 'axios'; // Import axios
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Dropdown } from 'react-native-element-dropdown';

const NewActivityRegistrationScreen = ({ navigation }) => {
//    activityID string, activityName string, description string, location string, date string, maxCount int, facultyID string) 
    const [activityID, setActivityID] = useState('');
    const [activityName, setActivityName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [maxCount, setMaxCount] = useState('');
    const [error, setError] = useState('');

    const [value, setValue] = useState(null);
    const [facultyList, setFacultyList] = useState([]);


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

    // Validate date format (DDMMYYYY)
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/;
    if (!dateRegex.test(date)) {
        setError('Please enter a valid date in the format DDMMYYYY.');
        return;
    }

        
    // Validate faculty ID format (F1, F2, ...)
    const facultyIDRegex = /^F\d+$/;
    if (!facultyIDRegex.test(value)) {
        setError('Please enter a valid Faculty ID in the format F1, F2, etc.');
        return;
    }

    // Validate max count as a number
    if (isNaN(maxCount) || maxCount <= 0) {
        setError('Please enter a valid Max Seats as a positive number.');
        return;
    }

    // Validate activity ID format (E1, E2, ...)
    const activityIDRegex = /^E\d+$/;
    if (!activityIDRegex.test(activityID)) {
        setError('Please enter a valid Activity ID in the format E1, E2, etc.');
        return;
    }

    if (!activityID || !activityName || !description || !location || !date || !maxCount || !value) {
            setError('Please fill out all fields.');
            return;
        }

        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddExtracurricularActivity';


        const formData = new URLSearchParams();
        formData.append("args", activityID.toUpperCase());
        formData.append("args", activityName.toUpperCase());
        formData.append("args", description);
        formData.append("args", location.toUpperCase());
        formData.append("args", date);
        formData.append("args", maxCount);
        formData.append("args", value);
        // formData.append("args", JSON.stringify(coursesToAdd));


        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('AddExtracurricularActivity response:', response.data);
            Alert.alert(`Added ${activityID} into Extracurricular Activity List`);
            setError('Successfully Registered.');
            return;
            // Handle success (if needed)
        } catch (error) {
            // console.error('Error Registering Activity:', error);
            Alert.alert('Error', 'Failed to Add');
            setError('Error Registering Activity.');
            return;
        }

        // Clear form fields after registration
        // setRollNo('');
        // setName('');
        // setProgram('');
        // setDepartment('');

    };

    return (
            <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Card elevation={5} style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Activity to be added...</Title>

                    <TextInput
                        style={styles.input}
                        placeholder="Activity ID"
                        onChangeText={setActivityID}
                        value={activityID}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Activity Name"
                        onChangeText={setActivityName}
                        value={activityName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        onChangeText={setDescription}
                        value={description}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        onChangeText={setLocation}
                        value={location}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Date [DDMMYYYY]"
                        onChangeText={setDate}
                        value={date}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Max seats"
                        onChangeText={setMaxCount}
                        value={maxCount}
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
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <PaperButton
                            mode="contained"
                            // style={styles.button}
                            style={[styles.button, { backgroundColor: '#4CAF50' }]} // Change background color to green
                            onPress={handleRegister}
                            color="#4CAF50"
                            labelStyle={styles.buttonText}
                        >
                            Register
                        </PaperButton>
                        
                    </Card.Content>
                </Card>
                </ScrollView>
                <View style={styles.bottomBar}>
                    <PaperButton
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
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Light background color
        paddingBottom: 40,
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
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 22,
    },
    input: {
        height: 40,
        borderColor: '#4CAF50',
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

export default NewActivityRegistrationScreen;
