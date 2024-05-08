import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput , Alert} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ExistingFacultiesScreen = ({ navigation }) => {
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFacultyName, setExpandedFacultyName] = useState(null); // Track expanded program

    useEffect(() => {
        fetchFaculties();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllFaculties';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllFaculties';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchFaculties = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('GetAllFaculties response:', response.data);
            setFaculties(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching Faculties:', error);

            setIsLoading(false);
        }
    };

    const toggleExpand = (facultyName) => {
        if (expandedFacultyName === facultyName) {
            // Collapse the currently expanded faculty
            setExpandedFacultyName(null);
        } else {
            // Expand the clicked program and collapse the previously expanded one
            setExpandedFacultyName(facultyName);
        }
    };

    const sortFacultiesByFacultyID = () => {
        const sortedFaculties = [...faculties].sort((a, b) => {
            const comparison = a.facultyID.localeCompare(b.facultyID);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setFaculties(sortedFaculties);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderFacultyItem = ({ item }) => {
        const { facultyID, facultyName, department } = item;

        const isExpanded = expandedFacultyName === facultyName;

        // Filter faculties based on search query
        const normalizedFacultyName = facultyName ? facultyName.toLowerCase() : '';
        const normalizedFacultyID = facultyID ? facultyID.toLowerCase() : '';
        const normalizedDepartmentID = department ? department.toLowerCase() : '';
        if (!normalizedFacultyName.includes(searchQuery.toLowerCase()) && !normalizedFacultyID.includes(searchQuery.toLowerCase()) && !normalizedDepartmentID.includes(searchQuery.toLowerCase())) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.facultyItem} onPress={() => toggleExpand(facultyName)}>
                <Text style={styles.facultyName}>{facultyName}</Text>
                <Text style={styles.facultyID}>Faculty ID: {facultyID}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Department ID: {department}</Text>
                    </View>
                )}
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.viewEnrolledButton}
                        onPress={() => handleRemoveFaculty(facultyID)} // Pass a function reference
                    >
                        <Text style={styles.viewEnrolledButtonText}>Remove Faculty</Text>
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
                    placeholder="Search by faculty name or ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortFacultiesByFacultyID}>
                    <Text style={styles.sortButtonText}>Sort by Faculty ID ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={faculties}
                keyExtractor={(item) => item.facultyID}
                renderItem={renderFacultyItem}
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


const handleRemoveFaculty = async (facultyID) => {

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/RemoveFaculty';
    const formData = new URLSearchParams();
    formData.append("args", facultyID.toUpperCase());
    try {
        const response = await axios.post(baseURL, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log('RemoveFaculty response:', response.data);
        Alert.alert(`Removed ${facultyID} from Faculty List`);

    } catch (error) {
        // console.error('Error Removing Faculty:', error);
        Alert.alert('Error', 'Failed to Remove');
        return;
    }
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
    facultyItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    facultyName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    facultyID: {
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

export default ExistingFacultiesScreen;
