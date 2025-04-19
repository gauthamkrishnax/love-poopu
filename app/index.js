import { useEffect, useState, useCallback, useContext } from 'react';
import { ImageBackground, StyleSheet, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig.js';

import SendLove from './screens/SendLove.js';
import LoveLetter from './screens/LoveLetter.js';
import Dingolfy from './screens/Dingolfy.js';
import SignIn from './screens/SignIn.js';
import OAuthRedirect from './oauthredirect.js';

import { ThemeProvider, useTheme } from '../hooks/themeContext.js';
import { AssetProvider } from '../hooks/assetContext.js';
import { UserProvider } from '../hooks/userContext.js';

import { requestPermissions, scheduleRegularNotifications } from '../utils/notificationHandler.js';
import { ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Logout from './screens/Logout.js';
import { getAsset } from '../hooks/assetContext.js';
import NicknameForm from './screens/NicknameForm.js';
import ConnectPartner from './screens/ConnectPartner.js';
import CollectHeadImage from './screens/CollectHeadImage.js';


WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const MyTabs = createMaterialTopTabNavigator({
    screens: {
        SendLove: SendLove,
        LoveLetter: LoveLetter,
        Dingolfy: Dingolfy,
    },
});

export default function App() {
    const [user, setUser] = useState(null);
    const [appIsReady, setAppIsReady] = useState(false);
    const [splashScreenHidden, setSplashScreenHidden] = useState(false);

    const [assets, setAssets] = useState([]);
    const { colors, font } = useTheme();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return unsubscribe; // Cleanup listener
    }, []);


    useEffect(() => {
        async function loadResourcesAndData() {
            try {
                console.log("Loading fonts...");
                await Font.loadAsync({
                    "Comic_CAT": require("../assets/fonts/Comic_CAT.ttf"),
                });

                console.log("Loading assets...");
                const assets = await Asset.loadAsync([
                    require("../assets/images/background1.jpg"),
                    require("../assets/images/temp-headshots.png"),
                    require("../assets/images/arrow.png"),
                ]);

                setAssets(assets);
            } catch (e) {
                console.warn(e);
            } finally {
                console.log("Assets loaded, setting appIsReady to true");
                setAppIsReady(true);
            }
        }

        loadResourcesAndData();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && !splashScreenHidden) {
            console.log("Hiding splash screen...");
            await SplashScreen.hideAsync();
            setSplashScreenHidden(true); // Mark splash screen as hidden
        }
    }, [appIsReady, splashScreenHidden]);

    if (!appIsReady) {
        console.log("App is not ready yet");
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    const navigatorStyle = {
        tabBarStyle: {
            fontFamily: font.primary,
            backgroundColor: colors.primary,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderBottomWidth: 0, // Ensure no bottom border
        },
        tabBarLabelStyle: {
            fontSize: 14,
            fontFamily: font.primary,
        },
        tabBarIndicatorStyle: {
            backgroundColor: colors.teritiary,
            height: 4,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarPressColor: colors.teritiary,
    };

    return (
        <ThemeProvider>
            {!user ?
                <>
                    <ImageBackground source={require("../assets/images/background1.jpg")} style={StyleSheet.absoluteFillObject} resizeMode="stretch">
                        <Stack.Navigator screenOptions={{
                            headerShown: false,
                            statusBarBackgroundColor: "transparent",
                            initialRouteName: "OAuthRedirect",
                        }}  >
                            <Stack.Screen name="OAuthRedirect" component={OAuthRedirect} />
                            {/* <Stack.Screen narme="NicknameForm" component={NicknameForm} /> */}
                            {/* <Stack.Screen name="ConnectPartner" component={ConnectPartner} /> */}
                            {/* <Stack.Screen name="CollectHead" component={CollectHeadImage} */}
                        </Stack.Navigator>
                    </ImageBackground>
                </> :
                <SafeAreaView onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: colors.primary }}>
                    <StatusBar style="dark" backgroundColor="#ffffff" />
                    <MyTabs.Navigator screenOptions={navigatorStyle}>
                        <MyTabs.Screen name="Send Love" component={SendLove} />
                        <MyTabs.Screen name="Love Letter" component={LoveLetter} />
                        <MyTabs.Screen name="Dingolfy" component={Dingolfy} />
                    </MyTabs.Navigator>
                </SafeAreaView>
            }
        </ThemeProvider >
    );
}