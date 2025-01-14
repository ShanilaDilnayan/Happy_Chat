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

SplashScreen.preventAutoHideAsync();
const emptyLogoPath = require("../assets/empty.jpg");
const signupimage = require("../assets/signup.png");

export default function signup() {

  const [getImage, setImage] = useState(emptyLogoPath);
  const [getCoverImage, setCoverImage] = useState(signupimage);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "DancingScript-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
    "LilitaOne-Regular": require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styleSheet.main}>
      <StatusBar hidden={true} />

      <View style={styleSheet.cover_view}>

        <Pressable style={styleSheet.place} onPress={
          async () => {
            let result = await ImagePicker.launchImageLibraryAsync({});

            if (!result.canceled) {
              setCoverImage(result.assets[0].uri);
            }
          }}>

          <Image source={getCoverImage} style={styleSheet.coverImage}  />
        </Pressable>

      </View>

      <View style={styleSheet.body}>

        <View style={styleSheet.view1}>

          <Pressable style={styleSheet.place} onPress={
            async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}>

            <Image source={getImage} style={styleSheet.image2}  />
          </Pressable>

          <Text style={styleSheet.text1}>Create Account</Text>


          <Text style={styleSheet.text3}>Mobile</Text>
          <TextInput style={styleSheet.input1} inputMode="tel" maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }} />

          <Text style={styleSheet.text3}>First Name</Text>
          <TextInput style={styleSheet.input1} inputMode="text" onChangeText={
            (text) => {
              setFirstName(text);
            }} />

          <Text style={styleSheet.text3}>Last Name</Text>
          <TextInput style={styleSheet.input1} inputMode="text" onChangeText={
            (text) => {
              setLastName(text);
            }} />

          <Text style={styleSheet.text3}>Password</Text>
          <TextInput style={styleSheet.input1} secureTextEntry={true} inputMode="text" maxLength={20} onChangeText={
            (text) => {
              setPassword(text);
            }} />

          <Pressable
            style={styleSheet.pressable1} onPress={
              async () => {

                let formData = new FormData();
                formData.append("mobile", getMobile);
                formData.append("firstName", getFirstName);
                formData.append("lastName", getLastName);
                formData.append("password", getPassword);

                if (getImage != null) {
                  formData.append("avatarImage",
                    {
                      name: "avatar.png",
                      type: "image/png",
                      uri: getImage
                    }
                  );
                }

                let response = await fetch(
                  process.env.EXPO_PUBLIC_URL + "/HappyChat/SignUp",
                  {
                    method: "POST",
                    body: formData,

                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {

                    router.replace("/");

                  } else {
                    Alert.alert("Error", json.message);
                  }
                }
              }}>

            <FontAwesome name="sign-in" size={22} color={"white"} />
            <Text style={styleSheet.text4}>Sign Up</Text>
          </Pressable>

          <Pressable
            style={styleSheet.pressable2} onPress={
              () => {
                router.push("/");
              }}>

            <Text style={styleSheet.text5}>Already Registered? <Text style={{ color: "blue" }}>Go to Sign In</Text></Text>
          </Pressable>

        </View>
      </View>

    </View>
  );
}

const styleSheet = StyleSheet.create({

  main: {
    flex: 1,
  },
  cover_view: {
    backgroundColor: "#f753be",
    flex: 1,
    paddingHorizontal: 50,
    rowGap: 10,
  },
  body: {
    marginTop: -50,
    paddingHorizontal: 50,
    backgroundColor: "white",
    flex: 3,
    paddingHorizontal: 50,
    rowGap: 10,
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
  },

  view1: {
    marginTop: -60,
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
    marginTop: 0,
    marginLeft: 0,
  },

  coverImage:{
    width: 450,
    height: 235,
    alignSelf: "center",
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
    marginBottom: 20,
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
    height: 45,
    backgroundColor: "#f753be",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
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
