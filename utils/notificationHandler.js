import * as Notifications from 'expo-notifications';
import loveNotifications from '../constants/Notifications';

const INTERVAL_MINUTES = 2; // Send notification every 2 minutes

// Request notification permissions
export async function requestPermissions() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true, // Ensure alert is shown
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        return false;
    }
    return true;
}

// Function to send a local notification
export async function sendLocalNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
        },
        trigger: null,
    });
}

// Function to check if it's daytime
const isDaytime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 8 && currentHour < 23; // Daytime: 7 AM to 7 PM
};

// Function to schedule notifications while avoiding night hours
export async function scheduleRegularNotifications() {

    if (!isDaytime()) {
        console.log("It's not daytime. Notifications will not be scheduled.");
        return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing notifications

    const interval = INTERVAL_MINUTES * 60 * 1000; // Convert minutes to milliseconds

    let message = loveNotifications[Math.floor(Math.random() * loveNotifications.length)];

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
        content: {
            title: message.title,
            body: message.body,
        },
        trigger: {
            seconds: interval / 1000, // Convert milliseconds to seconds
            repeats: true, // Repeat the notification},
        },
    });
}


export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}