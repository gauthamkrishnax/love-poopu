import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, StyleSheet } from "react-native";

export default function BasicTheme({ children }) {
    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <ImageBackground source={require("../../assets/images/background1.jpg")} style={StyleSheet.absoluteFillObject} resizeMode="stretch">
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {children}
                </SafeAreaView>
            </ImageBackground >
        </>
    )
}