import { useEffect, useState, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";

import SendLove from './screens/SendLove.js';
import LoveLetter from './screens/LoveLetter.js';
import Dingolfy from './screens/Dingolfy.js';

import { ThemeProvider, useTheme } from '../hooks/themeContext.js';
import { AssetProvider } from '../hooks/assetContext.js';


SplashScreen.preventAutoHideAsync();

const MyTabs = createMaterialTopTabNavigator({
    screens: {
        SendLove: SendLove,
        LoveLetter: LoveLetter,
        Dingolfy: Dingolfy,
    },
});


export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const { colors, font } = useTheme();
    const [assets, setAssets] = useState([]);

    useEffect(() => {

        async function loadResourcesAndData() {
            try {
                await Font.loadAsync({
                    "Comic_CAT": require("../assets/fonts/Comic_CAT.ttf"),
                });

                const assets = await Asset.loadAsync([
                    require("../assets/images/bg.jpg"),
                    require("../assets/images/temp-headshots.png"),
                ]);

                setAssets(assets);

            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        loadResourcesAndData();

    }, [])


    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
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
    }

    return (
        <ThemeProvider onLayout={onLayoutRootView}>
            <AssetProvider value={{ assets }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
                    <StatusBar style="dark" backgroundColor="#ffffff" />
                    <MyTabs.Navigator
                        screenOptions={navigatorStyle}
                    >
                        <MyTabs.Screen name="Send Love" component={SendLove} />
                        <MyTabs.Screen name="Love Letter" component={LoveLetter} />
                        <MyTabs.Screen name="Dingolfy" component={Dingolfy} />
                    </MyTabs.Navigator>
                </SafeAreaView>
            </AssetProvider>
        </ThemeProvider>
    );
}

