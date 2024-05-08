

import React, { useState } from 'react';
import { View, Button, Text, Alert, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'
import { ImageZoomViewer } from 'react-native-image-zoom-viewer';
import { S3 } from 'aws-sdk';
const axios = require('axios');
import { useNavigation } from '@react-navigation/native';
const AddCertificatesScreen = () => {
    const [fileUri, setFileUri] = useState(null);
    const [uploadEnabled, setUploadEnabled] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                // copyToCacheDirectory: true, // Ensure the file is copied to the cache directory
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


    const handleUpload = async () => {
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
                // { text: 'OK', onPress: () => setFileUri(null) }
            ]);
        } catch (error) {
            console.error('Error uploading file:', error);
            Alert.alert('Upload Failed', 'An error occurred while uploading the file');
        }
    };
    const handleView = async () => {
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
                Key: fileUri.split('/').pop(),
                Expires: 300,
            })
            setFile(url);
            console.log('download url: ', url);
        }
        catch (error) {
            console.error('Error downloading image:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.Button1} onPress={pickDocument} >
                    <Text style={styles.ButtonText1}>Pick File </Text>
                </TouchableOpacity>
                {fileUri && <Image source={{ uri: fileUri }} style={styles.previewImage} />}
                <TouchableOpacity style={styles.Button1} onPress={handleUpload} disabled={!uploadEnabled} >
                    <Text style={styles.ButtonText1}>Upload File </Text>
                </TouchableOpacity>
                {file && <Image source={{ uri: file }} style={{ width: 200, height: 200 }} />}
                <TouchableOpacity style={styles.Button1} onPress={handleView} >
                    <Text style={styles.ButtonText1}>View File </Text>
                </TouchableOpacity>
                        </View>
                </>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    previewImage: {
        width: 200,
        height: 200,
        // marginBottom: 20,
        marginTop: 20,
        resizeMode: 'contain',
    },
    buttonContainer: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    Button1: {
        backgroundColor: '#7E57C2',
        justifyContent: 'space-between',
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    ButtonText1: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddCertificatesScreen;
