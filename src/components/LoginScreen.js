// LoginScreen.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Card elevation={5} style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>CampBlock</Title>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('Student')}
                        color="#7E57C2"
                        labelStyle={styles.buttonText}
                    >
                        Login as Student
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('Faculty')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Login as Faculty
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('Admin')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        Login as Admin
                    </Button>
                    {/* <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('LedgerUpdate')}
                        color="#EC407A"
                        labelStyle={styles.buttonText}
                    >
                        View Ledger Updates
                    </Button> */}
                </Card.Content>
            </Card>
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
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#7E57C2',
        fontWeight: 'bold',
        fontSize: 31,
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
});

export default LoginScreen;
