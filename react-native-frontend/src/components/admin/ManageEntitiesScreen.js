import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library

const ManageEntitiesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    {/* <Title style={styles.title}>Manage Student</Title> */}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ManageDepartments')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Departments
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ManagePrograms')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Programs
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ManageFaculties')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Faculties
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ManageCourses')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Courses
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('ManageStudents')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Students
                    </Button>
                </Card.Content>
            </Card>
            <View style={styles.bottomBar}>
                <Button
                    style={styles.bottomBarButton}
                    onPress={() => navigation.navigate('AdminDashboard')}
                    // onPress={() => Alert.alert(`No way to go back anymore!`)}
                    icon={() => (
                        <>
                            <Icon name="arrow-left" size={30} color="#7E57C2" />
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

export default ManageEntitiesScreen;



// import React from 'react';
// import { View, Button, StyleSheet, Text } from 'react-native';

// const ManageEntitiesScreen = ({ navigation }) => {
//     return (
//         <View style={styles.container}>
//             <View style={styles.buttonContainer}>
//                 <Button
//                     title={"> Departments"}
//                     onPress={() => navigation.navigate('ManageDepartments')}
//                     color="#EC407A" // Pink color for button
//                 />
//                 <Button
//                     title={"> Programs"}
//                     onPress={() => navigation.navigate('ManagePrograms')}
//                     color="#7E57C2" // Violet color for button
//                 />
//                 <Button
//                     title={"> Courses"}
//                     onPress={() => navigation.navigate('ManageCourses')}
//                     color="#42A5F5" // Blue color for button
//                 />
//                 <Button
//                     title={"> Faculties"}
//                     onPress={() => navigation.navigate('ManageFaculties')}
//                     color="#ff79c6" // yellow color for button
//                 />
//                 <Button
//                     title={"> Students"}
//                     onPress={() => navigation.navigate('ManageStudents')}
//                     color="#ff00cc" // Pink color for button
//                 />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#282828', // Terminal background color
//     },
//     link: {
//         color: '#FFFFFF', // Text color
//         marginBottom: 10,
//     },
//     buttonContainer: {
//         marginTop: 20,
//     },
// });

// export default ManageEntitiesScreen;


























