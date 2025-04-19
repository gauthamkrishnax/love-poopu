import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, Alert, ImageBackground } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CollectHeadImage() {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "You need to grant permission to access the gallery.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "You need to grant permission to use the camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/images/background1.jpg")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="stretch"
        >
            <View style={styles.container}>
                <Text style={styles.title}>Upload Your Image</Text>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <View style={styles.buttonContainer}>
                    <Button title="Pick an Image" onPress={pickImage} />
                    <Button title="Take a Photo" onPress={takePhoto} />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: "Comic_CAT",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#fff",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
});