import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomPicker = ({ isVisible, options, onSelect }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => onSelect('')} // Handle modal close
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.option}
                            onPress={() => onSelect(option)}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default CustomPicker;
