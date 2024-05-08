import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
const LedgerUpdateScreen = () => {
    const [ledgerUpdates, setLedgerUpdates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortByTimestampDesc, setSortByTimestampDesc] = useState(true);

    const navigation = useNavigation();


    useEffect(() => {
        fetchLedgerUpdates();
    }, []);

    // GetAllLedgerUpdates
    // Define the API endpoint and parameters
    const baseURL = 'https://measured-wasp-terminally.ngrok-free.app/GetAllLedgerUpdates'; // Replace with your API base URL
    const chaincodeid = 'basic';
    const channelid = 'mychannel';
    const functionName = 'GetAllLedgerUpdates';
    // const args = userData.rollNo;

    // https://measured-wasp-terminally.ngrok-free.app/GetEnrollment?chaincodeid=basic&channelid=mychannel&function=GetEnrollment&args=CS22M037


    // Construct the complete URL with query parameters
    // const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}&args=${args}`;
    const apiURL = `${baseURL}?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${functionName}`;



    const fetchLedgerUpdates = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('API Response for LedgerUpdate:', response.data); // Log the API response data
            setLedgerUpdates(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching ledger updates:', error);
            setIsLoading(false);
        }
    };

    const handleSortByTimestamp = () => {
        const sortedUpdates = [...ledgerUpdates].sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return sortByTimestampDesc ? dateB - dateA : dateA - dateB;
        });
        setLedgerUpdates(sortedUpdates);
        setSortByTimestampDesc(!sortByTimestampDesc);
    };


    // const renderLedgerUpdate = ({ item }) => {
    //     return (
    //         <TouchableOpacity onPress={() => handleExpand(item)}>
    //             <View style={styles.updateContainer}>
    //                 <Text style={styles.timestamp}>Timestamp: {item.timestamp}</Text>
    //                 <Text style={styles.entry}>Entry: {item.entry}</Text>
    //                 {/* Additional details to expand */}
    //                 {item.isExpanded && (
    //                     <View style={styles.expandContainer}>
    //                         <Text>Updated By: {item.updatedBy}</Text>
    //                         {/* Add more details as needed */}
    //                     </View>
    //                 )}
    //             </View>
    //         </TouchableOpacity>
    //     );
    // };
    const renderLedgerUpdate = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleExpand(item)}>
                <View style={styles.updateContainer}>
                    <Text style={styles.timestamp}>Timestamp: {item.timestamp}</Text>
                    <Text style={styles.entry}>Entry: {item.entry}</Text>
                    {/* Additional details to expand */}
                    {item.isExpanded && (
                        <View style={styles.expandContainer}>
                            <Text>Updated By: {item.updatedBy}</Text>
                            {/* Add more details as needed */}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const handleExpand = (selectedItem) => {
        const updatedUpdates = ledgerUpdates.map((update) =>
            update === selectedItem ? { ...update, isExpanded: !update.isExpanded } : update
        );
        setLedgerUpdates(updatedUpdates);
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.sortButton} onPress={handleSortByTimestamp}>
                <Text style={styles.sortButtonText}>{sortByTimestampDesc ? 'Sort by Oldest First' : 'Sort by Newest First'}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={ledgerUpdates}
                // keyExtractor={(item, index) => index.toString()}
                keyExtractor={(item, index) => `${item.timestamp}-${index}`}
                renderItem={renderLedgerUpdate}
            />
            
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    // onPress={() => navigation.navigate('StudentDashboard')}
                    onPress={() => navigation.goBack()}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={40} color="#7E57C2" />
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
        // flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    updateContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    timestamp: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'red'
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
    entry: {
        fontSize: 14,
        color: '#333',
    },
    expandContainer: {
        marginTop: 10,
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
        marginBottom: 2,
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

export default LedgerUpdateScreen;
