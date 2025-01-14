import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();
const emptyLogoPath = require("../assets/empty.jpg");

export default function signup() {

  const [getImage, setImage] = useState(emptyLogoPath);

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "DancingScript-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
    "LilitaOne-Regular": require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  useEffect(() => {
    async function fetchData() {

      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(process.env.EXPO_PUBLIC_URL + "/HappyChat/AvatarImages/" + user.mobile + ".png");

    }

    fetchData();
  }, []
  );

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const signupimage = require("../assets/signup.png");

  return (

    <LinearGradient colors={["rgba(244, 52, 151, 0.8)", "transparent"]}>
      <StatusBar hidden={true} />

      <ScrollView>

        <View style={styleSheet.view1}>

          <Image source={signupimage} style={styleSheet.image1} contentFit={"contain"} />

          <Text style={styleSheet.text1}>User Profile</Text>

          <Pressable style={{ position: "absolute", alignSelf: "flex-end", padding: 20 }} onPress={
            () => {
              AsyncStorage.removeItem("user");
              router.replace("/");
            }}>

            <AntDesign name="logout" size={28} color="black" />
          </Pressable>

          <Pressable style={styleSheet.place} onPress={
            async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}>

            <Image source={getImage} style={styleSheet.image2} contentFit={"contain"} />
          </Pressable>

          <Text style={styleSheet.text3}>Mobile</Text>
          <TextInput style={styleSheet.input1} inputMode="tel" maxLength={10} />

          <Text style={styleSheet.text3}>First Name</Text>
          <TextInput style={styleSheet.input1} inputMode="text" />

          <Text style={styleSheet.text3}>Last Name</Text>
          <TextInput style={styleSheet.input1} inputMode="text" />

          <Text style={styleSheet.text3}>Password</Text>
          <TextInput style={styleSheet.input1} secureTextEntry={true} inputMode="text" maxLength={20} />

          <Pressable
            style={styleSheet.pressable1} onPress={
              async () => {

                // let formData = new FormData();
                // formData.append("mobile", getMobile);
                // formData.append("firstName", getFirstName);
                // formData.append("lastName", getLastName);
                // formData.append("password", getPassword);

                // if (getImage != null) {
                //   formData.append("avatarImage",
                //     {
                //       name: "avatar.png",
                //       type: "image/png",
                //       uri: getImage
                //     }
                //   );
                // }

                // let response = await fetch(
                //   process.env.EXPO_PUBLIC_URL + "/HappyChat/SignUp",
                //   {
                //     method: "POST",
                //     body: formData,

                //   }
                // );

                // if (response.ok) {
                //   let json = await response.json();
                //   if (json.success) {

                //     router.replace("/");

                //   } else {
                // Alert.alert("Error", json.message);
                Alert.alert("Success !", "Profile Update");
                router.push("/home");

                //   }
                // }
              }}>

            <MaterialIcons name="update" size={24} color="white" />
            <Text style={styleSheet.text4}>Update</Text>
          </Pressable>

          <Pressable
            style={styleSheet.pressable2} onPress={
              () => {
                router.push("/home");
              }}>

            <Text style={styleSheet.text5}><Text style={{ color: "red" }}>Cancel</Text></Text>
          </Pressable>

        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({

  view1: {
    flex: 1,
    paddingHorizontal: 50,
    rowGap: 10,
  },

  image1: {
    marginTop: -80,
    borderRadius: 100,
    width: 500,
    height: 500,
    alignSelf: "center",
    marginBottom: -80,
  },

  place: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 210,
  },

  image2: {
    borderRadius: 100,
    width: 125,
    height: 125,
    alignSelf: "center",
  },

  text1: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "Montserrat-Bold",
  },

  text2: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "DancingScript-Regular",
    marginBottom: 10,
  },

  text3: {
    fontSize: 15,
  },

  text4: {
    fontSize: 20,
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
  text5: {
    fontSize: 15,
  },

  input1: {
    width: "100%",
    height: 45,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    borderColor: "#f753be",

  },

  pressable1: {
    height: 40,
    width: "50%",
    backgroundColor: "#f753be",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    columnGap: 12,
  },

  pressable2: {
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
