import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ExistingDepartmentsScreen = ({ navigation }) => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDepartmentName, setExpandedDepartmentName] = useState(null); // Track expanded program

    useEffect(() => {
        fetchDepartments();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllDepartments';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllDepartments';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('GetAllDepartments response:', response.data);
            setDepartments(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching Faculties:', error);
            setIsLoading(false);
        }
    };

    const toggleExpand = (departmentName) => {
        if (expandedDepartmentName === departmentName) {
            // Collapse the currently expanded departments
            setExpandedDepartmentName(null);
        } else {
            // Expand the clicked departments and collapse the previously expanded one
            setExpandedDepartmentName(departmentName);
        }
    };

    const sortDepartmentsByDepartmentID = () => {
        const sortedDepartments = [...departments].sort((a, b) => {
            const comparison = a.departmentID.localeCompare(b.departmentID);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setDepartments(sortedDepartments);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderDepartmentItem = ({ item }) => {
        const { departmentID, departmentName } = item;

        const isExpanded = expandedDepartmentName === departmentName;

        // Filter faculties based on search query
        const normalizedDepartmentName = departmentName ? departmentName.toLowerCase() : '';
        const normalizedDepartmentID = departmentID ? departmentID.toLowerCase() : '';
        if (!normalizedDepartmentName.includes(searchQuery.toLowerCase()) && !normalizedDepartmentID.includes(searchQuery.toLowerCase())) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.departmentItem} onPress={() => toggleExpand(departmentName)}>
                <Text style={styles.departmentName}>{departmentName}</Text>
                {/* <Text style={styles.departmentID}>Department ID: {departmentID}</Text> */}
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Department ID: {departmentID}</Text>
                    </View>
                )}
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.viewEnrolledButton}
                        onPress={() => handleRemoveDepartment(departmentID)} // Pass a function reference
                    >
                        <Text style={styles.viewEnrolledButtonText}>Remove Department</Text>
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
                    placeholder="Search by department name or ID..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortDepartmentsByDepartmentID}>
                    <Text style={styles.sortButtonText}>Sort by Department ID ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={departments}
                keyExtractor={(item) => item.departmentID}
                renderItem={renderDepartmentItem}
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

const handleRemoveDepartment = async (departmentID) => {

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/RemoveDepartment';
    const formData = new URLSearchParams();
    formData.append("args", departmentID.toUpperCase());
    try {
        const response = await axios.post(baseURL, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log('RemoveDepartment response:', response.data);
        Alert.alert(`Removed ${departmentID} from department List`);

    } catch (error) {
        // console.error('Error Removing Department:', error);
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
    departmentItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    departmentName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    departmentID: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    additionalDetails: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
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

});

export default ExistingDepartmentsScreen;
