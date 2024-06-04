// notifications imports
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants"; // Optional
import React from "react";

import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet, Text, View, Alert } from "react-native";

// Register for push notifications [TODO: You can move this to a separate file]
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    // Don't forget to import Platform from react-native
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

    if (Constants.easConfig?.projectId) {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.easConfig.projectId, // you can hard code project id if you dont want to use expo Constants
        })
      ).data;
      console.log(token);
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  return token;
}

// Send the notification [TODO: You can move this to a separate file or export it as a function to be called from anywhere]
export async function schedulePushNotification() {
  console.log("Sending notification");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got notification! 🔔",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 0 }, // You can change this to any time interval you want
  });
}
