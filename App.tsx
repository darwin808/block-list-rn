import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Location from "expo-location";
import axios from "axios";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-fetch";
// const URL = "http://192.168.100.18:3000/api/";
const URL = "https://blocklist-proj-be.vercel.app/api/";

const LOCATION_TASK_NAME = "background-location-task";

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const payload = {
      lat: data?.locations[0]?.coords.latitude,
      long: data?.locations[0]?.coords?.longitude,
      time: data?.locations[0]?.timestamp,
    };

    const postLocation = async () => {
      await axios
        .post(URL, payload, { headers: headers })
        .then(function (response) {
          console.log(response.data, 5555555);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    const runContinues = async () => {
      await postLocation();
      setTimeout(runContinues, 10000);
    };

    runContinues();
    // do something with the locations captured in the background
  }
});

export default function App() {
  // const [location, setlocation] = React.useState<any>();
  // const getPosition = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     console.log("Permission to access location was denied");
  //     return;
  //   }

  //   let curentLocation = await Location.getCurrentPositionAsync({});
  //   setlocation(curentLocation);
  // };

  // const postLocation = async () => {
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   };
  //   const payload = {
  //     lat: location?.coords?.latitude,
  //     long: location?.coords?.longitude,
  //     time: new Date(),
  //   };
  //   await axios
  //     .post(URL, payload, { headers: headers })
  //     .then(function (response) {
  //       console.log(response.data, 5555555);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  // const runContinues = async () => {
  //   await postLocation();
  //   setTimeout(runContinues, 5000);
  // };

  // React.useEffect(() => {
  //   getPosition();
  // }, []);

  // React.useEffect(() => {
  //   runContinues();
  // }, []);

  return (
    <View>
      <Text>darwin</Text>
      <Button onPress={requestPermissions} title="Enable background location" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({});
