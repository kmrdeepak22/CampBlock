import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Image, Dimensions, Modal } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { useNavigation } from '@react-navigation/native';

const ViewRegisteredStudentsScreen = ({ route }) => {
    const navigation = useNavigation();

    const { activityID } = route.params;
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadEnabled, setUploadEnabled] = useState(false);


    //certificate upload to ipfs
    const [fileUri, setFileUri] = useState(null);
    const [fullScreen, setFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
    };


    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true, // Ensure the file is copied to the cache directory
                type: '*/*', // Allow all types of files
            });
            console.log('result after picking:', result)
            if (!result.canceled) {
                // Access the uri from the result
                const uri = result.assets[0].uri;
                setFileUri(uri);
                setUploadEnabled(true);
                console.log('Picked file URI:', uri);
            } else {
                console.log('No file picked');
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };


    useEffect(() => {
        fetchRegisteredStudents();
    }, []);

    const fetchRegisteredStudents = async () => {
        try {
            // Fetch enrolled students and their details
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const getStudentsFunction = 'GetStudentsByActivityIDInExtracurricular';
            const getEnrollmentFunction = 'GetEnrollment';

            const studentIDsResponse = await axios.get(
                `${baseURL}/${getStudentsFunction}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getStudentsFunction}&args=${activityID}`
            );
            const registeredStudentIDs = studentIDsResponse.data || [];

            const registeredStudentsDetails = await Promise.all(
                registeredStudentIDs.map(async (studentID) => {
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

            setStudents(registeredStudentsDetails);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching registered students:', error);
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

        const handleAddCertificate = async (studentID, activityID) => {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/AddCertificateForStudent';
            console.log("activityID inside handleAddCerti: ", activityID);

            //upload to aws and get the key
            if (!fileUri) {
                Alert.alert('Please select a file');
                return;
            }

            try {
                const s3 = new S3({
                    signatureVersion: 'v4',
                    accessKeyId: '12CECFEFEB7400A9E352',
                    Bucket: 'ipfs-campblock',
                    secretAccessKey: 'Njvwh69KuDMIf9b43va1iRcPDJEz4RfYUhHursx9',
                    endpoint: 'https://s3.filebase.com',
                });

                const response = await fetch(fileUri);
                const blob = await response.blob(); // Convert image data to Blob
                const filename = fileUri.split('/').pop(); // Extract filename from URI

                const params = {
                    Bucket: 'ipfs-campblock',
                    Key: filename,
                    Body: blob,
                };
                // const response = await s3.putObject(params);
                const res = await s3.putObject(params).promise();
                console.log('upload response:', res);

                Alert.alert('Upload Successful', 'File uploaded successfully', [
                    { text: 'OK', onPress: () => setFileUri(null) }
                ]);

                const key = filename;
                // const certificateToAdd = [
                //     {
                //         activityID, key,
                //     }
                // ];

                const formData = new URLSearchParams();
                formData.append("args", studentID);
                formData.append("args", activityID);
                formData.append("args", key);
                // formData.append("args", JSON.stringify(certificateToAdd));

                try {

                    const response = await axios.post(baseURL, formData, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });

                    console.log('certificate added successfully:', response.data);
                    // Optionally show an alert or update UI upon successful addition of grade
                    // Alert.alert('Certificate added successfully.');

                } catch (error) {
                    // console.error('Error adding certificate:', error);
                    Alert.alert('Error', 'Failed to add certificate.');
                }
                } catch (error) {
                    // console.error('Error uploading file:', error);
                    Alert.alert('Upload Failed', 'An error occurred while uploading the file');
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
                        <TouchableOpacity
                            style={styles.addGradeButton}
                        onPress={pickDocument}
                        >
                            <Text style={styles.addGradeButtonText}>Choose Certificate(Image only)</Text>
                        </TouchableOpacity>
                )}
                {isExpanded && (
                <View >
                    <TouchableOpacity onPress={toggleFullScreen}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: fileUri }} style={styles.previewImage} />
                        </View>
                    </TouchableOpacity>

                    <Modal visible={fullScreen} transparent={true}>
                        <View style={styles.modalContainer}>
                            <Image source={{ uri: fileUri }} style={styles.fullScreenImage} resizeMode="contain" />
                            <Button
                                style={styles.modalCloseButton}
                                onPress={toggleFullScreen}
                                icon={() => (
                                    <>
                                        <Icon name="close" size={80} color="red" />
                                        {/* <Text style={styles.addGradeButtonText} >Close</Text> */}
                                    </>
                                )}
                            />
                        </View>
                    </Modal>
                    </View>
                )}
                {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
                {isExpanded && (
                        <TouchableOpacity
                            style={styles.addGradeButton}
                        onPress={() => handleAddCertificate(studentID, activityID)}
                        >
                            <Text style={styles.addGradeButtonText}>Add Certificate</Text>
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
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('ViewActivitiesFaculty')}
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
    studentItem: {
        backgroundColor: '#4CAF50',
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
        color: 'black',
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
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: 200, // Adjust as needed
        height: 200, // Adjust as needed
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    closeIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    fullScreenImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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

export default ViewRegisteredStudentsScreen;

