import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';
import Button from "../../components/Button.js";
import { useNavigation } from "@react-navigation/native";



const firestore = getFirestore();
const auth = getAuth();

export default function NicknameForm() {
    const navigator = useNavigation();
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('nickname');
            if (stored) {
                setNickname(stored);
                setSaved(true);
            }
        })();
    }, [])

    const saveNickname = async () => {
        if (!nickname.trim()) return;

        setLoading(true);

        try {
            const uid = auth.currentUser?.uid;
            const myReferenceId = await AsyncStorage.getItem('myReferenceId') || Math.random().toString(36).substring(2, 10);


            await AsyncStorage.setItem('nickname', nickname);
            await AsyncStorage.setItem('myReferenceId', myReferenceId);

            if (uid) {
                const userRef = doc(firestore, 'users', uid);
                await setDoc(userRef, { nickname, myReferenceId }, { merge: true });
            }

            setSaved(true);

        } catch (error) {
            console.error("Error saving nickname:", error);
        } finally {
            setLoading(false);
            navigator.navigate("ConnectPartner");
        }
    }

    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <ImageBackground source={require("../../assets/images/background1.jpg")} style={StyleSheet.absoluteFillObject} resizeMode="stretch">
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <>
                            <View style={{ marginTop: 100 }}>
                                <Text style={{
                                    marginHorizontal: 30,
                                    fontFamily: "Comic_CAT",
                                    fontSize: 30,
                                    color: "#fff",
                                }}>What should your partner call you?</Text>
                                <TextInput
                                    style={
                                        {
                                            fontFamily: "Comic_CAT",
                                            marginTop: 10,
                                            marginHorizontal: 30,
                                            paddingLeft: 10,
                                            borderRadius: 5,
                                            height: 50,
                                            backgroundColor: "#fff",
                                            fontSize: 18,

                                        }
                                    }
                                    placeholder="Enter your cute nickname"
                                    value={nickname}
                                    onChangeText={setNickname}
                                />
                            </View>
                            <View style={{
                                marginTop: 20,
                                marginHorizontal: 30,
                            }}>
                                <Button title={saved ? "update" : "Save"} handlePress={saveNickname} size={18} />
                            </View>
                        </>
                    )}
                </SafeAreaView>
            </ImageBackground >
        </>
    )
}