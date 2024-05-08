import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';

const ExistingProgramsScreen = ({ navigation }) => {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProgramName, setExpandedProgramName] = useState(null); // Track expanded program

    useEffect(() => {
        fetchPrograms();
    }, []);

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllPrograms';
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllPrograms';
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('GetAllPrograms response:', response.data);
            setPrograms(response.data);
            setIsLoading(false);
        } catch (error) {
            // console.error('Error fetching programs:', error);
            setIsLoading(false);
        }
    };


    const toggleExpand = (programName) => {
        if (expandedProgramName === programName) {
            // Collapse the currently expanded program
            setExpandedProgramName(null);
        } else {
            // Expand the clicked program and collapse the previously expanded one
            setExpandedProgramName(programName);
        }
    };


    const sortProgramsByProgramName = () => {
        const sortedPrograms = [...programs].sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        setPrograms(sortedPrograms);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderProgramItem = ({ item }) => {
        const { name, maxSemesters, requiredCredits, maxCreditPerCredits, minCreditPerCredits } = item;

        const isExpanded = expandedProgramName === name;

        // Filter programs based on search query
        const normalizedProgramName = name ? name.toLowerCase() : '';
        if (!normalizedProgramName.includes(searchQuery.toLowerCase()) ) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.programItem} onPress={() => toggleExpand(name)}>
                <Text style={styles.programName}>{name}</Text>
                <Text style={styles.maxSemesters}>Max Semesters : {maxSemesters}</Text>
                {isExpanded && (
                    <View style={styles.additionalDetails}>
                        <Text>Total Required Credits for Degree: {requiredCredits}</Text>
                        <Text>Max Credits Per Semester: {maxCreditPerCredits}</Text>
                        <Text>Min Credits Per Semester: {minCreditPerCredits}</Text>
                    </View>
                )}
                {isExpanded && (
                    <TouchableOpacity
                        style={styles.viewEnrolledButton}
                        onPress={() => handleRemoveProgram(name)} // Pass a function reference
                    >
                        <Text style={styles.viewEnrolledButtonText}>Remove Program</Text>
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
                    placeholder="Search by program name..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.sortButton} onPress={sortProgramsByProgramName}>
                    <Text style={styles.sortButtonText}>Sort by Program Name ({sortOrder.toUpperCase()})</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={programs}
                keyExtractor={(item) => item.programName}
                renderItem={renderProgramItem}
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

const handleRemoveProgram = async (name) => {

    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/RemoveProgram';
    const formData = new URLSearchParams();
    formData.append("args", name.toUpperCase);
    try {
        const response = await axios.post(baseURL, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log('RemoveProgram response:', response.data);
        Alert.alert(`Removed ${name} from Program List`);

    } catch (error) {
        // console.error('Error Removing program:', error);
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
    programItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    programName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    maxSemesters: {
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

export default ExistingProgramsScreen;
