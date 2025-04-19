import React, { useState, useContext, useEffect } from "react";
import { View, Text, AppState, ImageBackground, StyleSheet, Image } from "react-native";
import { auth } from "../utils/firebaseConfig.js";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from "firebase/auth";
import { ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import { ANDROID_CLIENT_ID_2 } from '@env';

import * as Animatable from 'react-native-animatable';
import { useNavigation } from "expo-router";

import Button from "../components/Button.js";
import BasicTheme from "../components/ui/basicTheme.js";

WebBrowser.maybeCompleteAuthSession();


export default function Screen() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID_2,
        useProxy: false,
    });



    const navigation = useNavigation();

    // 🔹 Handle Google Sign - In response
    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).then((userCredentials) => {
                setUser(userCredentials.user);
                console.log("Navigating to Logout");
                navigation.goBack();
            })
                .catch((error) => {
                    console.log(error)
                });

        }
    }, [response]);

    useEffect(() => {
        setTimeout(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
            });
            console.log("User: ", user);
            if (user) {
                console.log("Navigating to Logout");
                navigation.navigate("Logout")
            }

            setLoading(false);

            return unsubscribe; // Cleanup listener
        }, 1000);
    }, []);



    return (

        <BasicTheme>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ marginTop: 100 }}>
                        <Animatable.View animation={"fadeIn"}>
                            <Text style={{
                                marginHorizontal: 80,
                                textAlign: "center",
                                fontFamily: "Comic_CAT",
                                fontSize: 40,
                                color: "#fff",
                            }}>Love is in the App</Text>
                        </Animatable.View>
                        <Animatable.View animation={"fadeInDown"} delay={200}>
                            <Text style={{
                                marginTop: 10,
                                marginHorizontal: 30,
                                textAlign: "center",
                                fontFamily: "Comic_CAT",
                                fontSize: 20,
                                color: "#eee",
                            }}>Your journey to cuteness begins here.  </Text>
                        </Animatable.View>
                    </View>
                    <Animatable.View animation={"fadeInDown"} delay={400}>
                        <Image source={require("../assets/images/arrow.png")} style={{ width: 80, height: 300, opacity: 0.8 }}></Image>
                    </Animatable.View>
                    <Animatable.View animation={"fadeInDown"} delay={600} >
                        <Animatable.View animation={"pulse"} iterationCount={"infinite"} style={{ marginBottom: 50 }}>
                            <Button title="Sign in with Google" size={22} disabled={!request} handlePress={() => {
                                promptAsync({ useProxy: false })
                            }} />
                        </Animatable.View>
                    </Animatable.View>
                </View>)}
        </BasicTheme>
    )
}