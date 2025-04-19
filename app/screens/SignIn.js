import React, { useEffect, useState, useContext } from "react";
import { Button, Text, View, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, useGoogleAuth } from "../../utils/firebaseConfig"
import { UserContext } from "../../hooks/userContext";
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';


WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
    const navigation = useNavigation();
    // const [google, setGoogle] = useState(null);
    const { request, response, promptAsync } = useGoogleAuth();

    console.log("Response:", response);
    console.log("SignIn request - :", request);
    // const { user, setUser } = useContext(UserContext);
    // const [loading, setLoading] = useState(true);

    // 🔹 Handle Google Sign - In response
    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).then((userCredentials) => {
                console.log("User signed in successfully:", userCredentials.user);
                setUser(userCredentials.user);
                setLoading(false);
            })
                .catch((error) => {
                    console.log(error)
                    setLoading(false);
                });

        }
    }, [response]);

    useEffect(() => {
        const handleDeepLink = (event) => {
            const url = event.url;
            const parsed = Linking.parse(url);

            if (parsed.path === 'oauthredirect') {
                console.log(response)
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);


    // if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    useEffect(() => {
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Sign in with Google" disabled={!request} onPress={() => promptAsync()} />
        </View>
    );

}