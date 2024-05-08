import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import UserContext from '../../UserContext';
import { S3 } from 'aws-sdk';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const ViewMyActivitiesScreen = () => {
    const { userData } = useContext(UserContext);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [expandedActivity, setExpandedActivity] = useState(null); // Track expanded activity
    const [activities, setActivities] = useState({}); // State to hold activity info
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [fullScreen, setFullScreen] = useState(false);
    const navigation = useNavigation();

    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
    };


    useEffect(() => {
        fetchEnrollmentData(userData.rollNo);
    }, [userData.rollNo]);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const getEnrollmentFunction = 'GetEnrollment';
    const getActivityFunction = 'GetExtracurricularActivity';
    const getCertificateFunction = 'GetCertificateForActivityAndStudent';

    const fetchEnrollmentData = async (rollNo) => {
        try {
            const apiURL = `${baseURL}/GetEnrollment?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getEnrollmentFunction}&args=${rollNo}`;
            const response = await axios.get(apiURL);
            console.log('Enrollment data response:', response.data);

            if (response.data && Array.isArray(response.data.extracurricular)) {
                setEnrollmentData(response.data.extracurricular);
            } else {
                // console.error('Invalid extracurricular data:', response.data);
            }
        } catch (error) {
            // console.error('Error fetching enrollment data:', error);
        }
    };

    const fetchActivityInfo = async (activityID) => {
        try {
            const apiURL = `${baseURL}/GetExtracurricularActivity?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getActivityFunction}&args=${activityID}`;
            const response = await axios.get(apiURL);
            if (response.data) {
                setActivities({ ...activities, [activityID]: response.data });
                console.log('Activity info:', response.data);
            }
        } catch (error) {
            // console.error('Error fetching activity info:', error);
        }
    };

    const toggleExpand = async (activityID) => {
        if (expandedActivity === activityID) {
            setExpandedActivity(null);
        } else {
            setExpandedActivity(activityID);
            await fetchActivityInfo(activityID);
        }
    };
    const renderActivityItem = ({ item }) => {
        const activityID = item;

        const isExpanded = expandedActivity === activityID;
        const activityInfo = activities[activityID];

        return (
            <TouchableOpacity style={styles.activityItem} onPress={() => toggleExpand(activityID)}>
                <Text style={styles.activityID}>{activityID}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Name: {activityInfo?.name}</Text>
                        <Text>Description: {activityInfo?.description}</Text>
                        <Text>Location: {activityInfo?.location}</Text>
                        <Text>Date: {activityInfo?.date}</Text>
                        <Text>Max Count: {activityInfo?.maxCount}</Text>
                        <Text>Faculty ID: {activityInfo?.facultyID}</Text>
                    </View>
                )}
                {/* {file && <Image source={{ uri: file }} style={{ width: 200, height: 200 }} />} */}
                {isExpanded && (
                    <View >
                        <TouchableOpacity onPress={toggleFullScreen}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: file }} style={styles.previewImage} />
                            </View>
                        </TouchableOpacity>

                        <Modal visible={fullScreen} transparent={true}>
                            <View style={styles.modalContainer}>
                                <Image source={{ uri: file }} style={styles.fullScreenImage} resizeMode="contain" />
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
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.viewEnrolledButton}
                        onPress={() => viewCertificate(activityID) } // Pass a function reference
                    >
                        <Text style={styles.viewEnrolledButtonText}>View Certificate</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const viewCertificate = async (activityID) => {
        const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetCertificateForActivityAndStudent'; // Update with your API URL

        const studentID = userData.rollNo;
        const formData = new URLSearchParams();
        formData.append("args", studentID);
        formData.append("args", activityID);
        try {
            const response = await axios.post(baseURL, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log('GetCertificateForActivityAndStudent response:', response.data);
            const key = response.data.key;
            console.log('key:', key);
            // Handle success (if needed)
            setIsLoading(true);
            const s3 = new S3({
                signatureVersion: 'v4',
                accessKeyId: '12CECFEFEB7400A9E352',
                secretAccessKey: 'Njvwh69KuDMIf9b43va1iRcPDJEz4RfYUhHursx9',
                Bucket: 'ipfs-campblock',
                region: '', // e.g., 'us-east-1'
                endpoint: 'https://s3.filebase.com', // or your S3 endpoint
            });

            try {
                const url = s3.getSignedUrl('getObject', {
                    Bucket: 'ipfs-campblock',
                    Key: key,
                    Expires: 300,
                })
                setFile(url);
                console.log('download url: ', url);
            }
            catch (error) {
                // console.error('Error downloading image:', error);
                Alert('Error!', 'Not Found.')
            } finally {
                setIsLoading(false);
            }




        } catch (error) {
            Alert.alert('Not Found!', 'Failed to get certificate.');
            // throw new Error('adding course failed');
        }
    };

    const renderActivities = () => {
        return (
            <FlatList
                data={enrollmentData}
                renderItem={renderActivityItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.activityList}
            />
        );
    };
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7E57C2" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by activity ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
            </View>
            {renderActivities()}
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('ViewExtraCurricularForStudent')}
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
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#4CAF50',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    activityList: {
        marginTop: 10,
    },
    activityItem: {
        backgroundColor: '#4CAF50',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    activityID: {
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
    viewEnrolledButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    viewEnrolledButtonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
        // borderColor: '#4CAF50',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        // width: '50%',
    },
    bottomBarText: {
        color: '#4CAF50', // Blue text color
        marginTop: 4,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ViewMyActivitiesScreen;


















