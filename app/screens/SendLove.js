import { useState, useEffect } from "react";
import { View, Text, Pressable, ImageBackground, StyleSheet, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { StatusBar } from 'expo-status-bar';
import * as Haptics from "expo-haptics";
import InfinityGraphics from "../../components/ui/InfinityGraphics.js";



export default function Home() {

    const [fontsLoaded, setFontsLoaded] = useState(false);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                "MeowScript-Regular": require("../../assets/fonts/MeowScript-Regular.ttf"),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="black" />
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/images/background.jpg')}
            style={styles.background}
        >
            <View style={{ position: "absolute", top: 100, left: -180, opacity: 0.3 }}>
                <InfinityGraphics />
            </View>
            <SafeAreaView style={styles.overlay}>
                <View>
                    <StatusBar style="dark" backgroundColor="#B64969" />
                    <Text style={styles.text}>Love Poopu</Text>
                </View>
                <View>
                    <Image source={require("../../assets/gifs/hugging.gif")} style={{ width: 220, height: 200 }} />
                </View>
                <View>
                    <Pressable
                        onPress={handlePress}
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? "#CAFFBF" : "white",
                            padding: 5,
                            paddingHorizontal: 20,
                            borderRadius: 50,
                            marginBottom: 100,
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 14,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 15.38,
                            elevation: 19
                        })}
                    >
                        <Text style={{
                            color: "#E15A75", fontSize: 18, fontFamily: "MeowScript-Regular"
                        }}>Send a Hug</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "strech",
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        color: "white",
        fontSize: 45,
        fontFamily: "MeowScript-Regular",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "red",
    }
});