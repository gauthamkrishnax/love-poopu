import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from "react-native";
import * as Haptics from "expo-haptics";
import InfinityGraphics from "../../components/InfinityGraphics.js";
import { getAsset } from "../../hooks/assetContext.js";
import { useTheme } from "../../hooks/themeContext.js";
import Button from "../../components/Button.js";
import { sendLocalNotification } from "../../utils/notificationHandler.js";
import loveNotifications from "../../constants/Notifications";


export default function Home() {
    const { colors, font } = useTheme();

    const handlePress = () => {
        let message = loveNotifications[Math.floor(Math.random() * loveNotifications.length)];

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const sendNotification = async () => {
            await sendLocalNotification(love);
        };
        sendNotification(message.title, message.body);
    };

    return (
        <ImageBackground source={{ uri: getAsset("bg") }} style={{ flex: 1 }} resizeMode="stretch">
            <View style={{ position: "absolute", top: 100, left: -180, opacity: 0.3 }}>
                <InfinityGraphics />
            </View>
            <View style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
            }}>
                <View style={{
                    marginTop: 50,
                }}>
                    <Text style={{
                        fontFamily: font.primary,
                        fontSize: 40,
                        color: colors.primary,
                    }}>Love Poopu</Text>
                </View>
                <View>
                    <Image source={{ uri: getAsset("temp-headshots") }} style={{ width: 350, height: 250 }}></Image>
                </View>
                <View>
                    <Button title={"Send Love"} handlePress={handlePress} />
                </View>
            </View>
        </ImageBackground>
    );
}

