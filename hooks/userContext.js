import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, getDocs, getDoc, setDoc, query, collection, where, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';



export const UserContext = createContext();
const firestore = getFirestore();


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Load nickname and myReferenceId from AsyncStorage
        const loadUserData = async () => {
            const nickName = await AsyncStorage.getItem('nickname');
            const myReferenceId = await AsyncStorage.getItem('myReferenceId');

            if (nickName) {
                setUser((prevUser) => ({ ...prevUser, lovePoopuNickname: nickName }));
            }

            if (myReferenceId) {
                setUser((prevUser) => ({ ...prevUser, lovePoopuMyReferenceId: myReferenceId }));
            }
        };

        // Load user data from Firestore
        const uid = auth.currentUser?.uid;
        const userRef = doc(firestore, 'users', uid)

        if (userRef) {
            (async () => {
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUser((prevUser) => ({ ...prevUser, firestoreData: userData }));
                        setUser((prevUser) => ({ ...prevUser, lovePoopuNickname: userData?.nickname }));
                        setUser((prevUser) => ({ ...prevUser, lovePoopuMyReferenceId: userData?.myReferenceId }));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            })();
        }

        loadUserData();

        return unsubscribe; // Cleanup listener
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}