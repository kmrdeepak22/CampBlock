import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const ManageProgramsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    {/* <Title style={styles.title}>Manage Faculties</Title> */}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ExistingPrograms')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        View Existing Programs
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('NewProgramRegistration')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Register New Program
                    </Button>
                </Card.Content>
            </Card>
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('ManageEntities')}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={30} color="#7E57C2" />
                            {/* <Text style={styles.bottomBarText}>Home</Text> */}
                        </>
                    )}
                />
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('AdminDashboard')}
                    icon={() => (
                        <>
                            <Icon name="home" size={30} color="#7E57C2" />
                            {/* <Text style={styles.bottomBarText}>Home</Text> */}
                        </>
                    )}
                />
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('LedgerUpdate')}
                    icon={() => (
                        <>
                            <Icon name="book" size={26} color="#7E57C2" />
                            {/* <Text style={styles.bottomBarText}>Ledger</Text> */}
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
    button: {
        marginVertical: 12,
        borderRadius: 8,
        paddingVertical: 7,
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

export default ManageProgramsScreen;
