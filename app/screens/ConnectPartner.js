import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, getDocs, setDoc, query, collection, where, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';
import Button from "../../components/Button.js";
import { UserContext } from "../../hooks/userContext.js";
import * as Clipboard from 'expo-clipboard';
import firebase from "firebase/compat/app";

// TODO:
// Once any one of partner enters the code, the other one should be able to see the connection
// and the connection should be saved in the database
// Connect the partner to the user

const firestore = getFirestore();
const auth = getAuth();


export default function ConnectPartner() {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [copyText, setCopyText] = useState("");
    const [partnerCode, setPartnerCode] = useState("");
    const [infoText, setInfoText] = useState("");

    const handleConnectPartners = async () => {
        setLoading(true);

        const currentUid = auth.currentUser?.uid;
        const q = query(collection(firestore, "users"), where("myReferenceId", "==", partnerCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setInfoText("No user found with that code.");
            setLoading(false);
            return;
        }

        const partnerDoc = querySnapshot.docs[0];
        const partnerUid = partnerDoc.id;

        if (partnerUid === currentUid) {
            setInfoText("You can't connect to yourself!");
            setLoading(false);
            return;
        }


        // Update both users
        await updateDoc(doc(firestore, "users", currentUid), {
            partnerId: partnerUid,
            PartnerReferenceId: partnerCode,
            partnerName: partnerDoc.data().nickname,
            connected: true,
            connectedAt: Timestamp.now()
        });

        console.log("Connected successfully!");

        await updateDoc(doc(firestore, "users", partnerUid), {
            partnerId: currentUid,
            PartnerReferenceId: user.lovePoopuMyReferenceId,
            partnerName: user.lovePoopuNickname,
            connected: true,
            connectedAt: Timestamp.now()
        });


        alert("Connected successfully!");
    }


    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
    };

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        const userRef = doc(firestore, 'users', uid);

        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                if (userData.connected && userData.partnerName) {
                    setInfoText(`You are connected to ${userData.partnerName}`);
                }
            }
        })

        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if (user && user.lovePoopuNickname && user.lovePoopuMyReferenceId) {
            setCopyText(user.lovePoopuMyReferenceId);
            setLoading(false);
        }
    })

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
                            <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center", marginVertical: 50 }}>
                                <View>
                                    <Text style={{
                                        marginHorizontal: 30,
                                        fontFamily: "Comic_CAT",
                                        fontSize: 30,
                                        color: "#fff",
                                        textAlign: "center",
                                    }}>"{user.lovePoopuNickname}, Are you ready to link hearts?"</Text>
                                    <Text style={{
                                        marginTop: 10,
                                        marginHorizontal: 30,
                                        textAlign: "center",
                                        fontFamily: "Comic_CAT",
                                        fontSize: 20,
                                        color: "#eee",
                                    }}>Share this secret love code with your partner. When they enter it, the universe will know you belong together 💘
                                    </Text>
                                    <TouchableOpacity onPress={() => copyToClipboard(user.lovePoopuMyReferenceId)}>
                                        <Text style={{
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            padding: 10,
                                            marginTop: 10,
                                            marginHorizontal: 30,
                                            textAlign: "center",
                                            fontFamily: "Comic_CAT",
                                            fontSize: 20,
                                            color: "#444",
                                        }}>{user.lovePoopuMyReferenceId}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View><Text style={{
                                    fontFamily: "Comic_CAT",
                                    fontSize: 30,
                                    color: "#fff",
                                    textAlign: "center",
                                }}>or</Text></View>
                                <View>
                                    <Text style={{
                                        marginHorizontal: 30,
                                        fontFamily: "Comic_CAT",
                                        fontSize: 30,
                                        color: "#fff",
                                        textAlign: "center",
                                    }}>Enter your Partner's code</Text>
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
                                        placeholder="Your partner's 8 digit code"
                                        value={partnerCode}
                                        onChangeText={setPartnerCode}
                                    />
                                    <View style={{
                                        marginTop: 20,
                                        marginHorizontal: 30,
                                    }}>
                                        <Button title="Connect" handlePress={() => handleConnectPartners().then(() => setLoading(false))} size={18} />
                                        <Text>{infoText}</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </SafeAreaView>
            </ImageBackground >
        </>
    )
}
