import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {

    const [getName, setName] = useState("");
    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "DancingScript-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
        "LilitaOne-Regular": require("../assets/fonts/LilitaOne-Regular.ttf"),
    });

    useEffect(
        () => {
            async function checkUserInAsyncStorage() {
                try {
                    let userJson = await AsyncStorage.getItem("user");

                    if (userJson != null) {
                        router.replace("/home");
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            checkUserInAsyncStorage();
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

    const coverImage = require("../assets/sign in.png");

    return (

        <LinearGradient colors={["rgba(244, 52, 151, 0.8)", "transparent"]}>
            <StatusBar hidden={true} />

            <ScrollView>

                <View style={styleSheet.view1}>

                    <Image source={coverImage} style={styleSheet.image1} contentFit={"contain"} />

                    <Text style={styleSheet.text1}>Sign In</Text>

                    <Text style={styleSheet.text2}>Hi, Welcome to Sign In ! Please Enter Your Data.</Text>

                    <Text style={styleSheet.text3}>Mobile</Text>
                    <TextInput style={styleSheet.input1} inputMode="tel" maxLength={10} onChangeText={
                        (text) =>
                            setMobile(text)
                    }
                        onEndEditing={
                            async () => {
                                if (getMobile.length == 10) {
                                    let response = await fetch(process.env.EXPO_PUBLIC_URL + "/HappyChat/GetLetters?mobile=" + getMobile);

                                    if (response.ok) {
                                        let json = await response.json();
                                        setName(json.letters);
                                    }
                                }
                            }}
                    />

                    <Text style={styleSheet.text3}>Password</Text>
                    <TextInput style={styleSheet.input1} secureTextEntry={true} inputMode="text" maxLength={20} onChangeText={
                        (text) => {
                            setPassword(text);
                        }}
                    />

                    <Pressable
                        style={styleSheet.pressable1} onPress={
                            async () => {

                                let response = await fetch(
                                    process.env.EXPO_PUBLIC_URL + "/HappyChat/SignIn",
                                    {
                                        method: "POST",
                                        body: JSON.stringify(
                                            {
                                                mobile: getMobile,
                                                password: getPassword,
                                            }
                                        ),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    }
                                );

                                if (response.ok) {
                                    let json = await response.json();
                                    if (json.success) {
                                        //user registration complete
                                        let user = json.user;
                                        Alert.alert("Welcome !", "Hi , " + user.first_name + " " + user.last_name);

                                        try {

                                            await AsyncStorage.setItem("user", JSON.stringify(user));
                                            router.replace("/home");

                                        } catch (e) {
                                            Alert.alert("Error", "Unable to process youe request");
                                        }

                                    } else {
                                        //problem occured
                                        Alert.alert("Error", json.message);
                                    }
                                }
                            }}>

                        <FontAwesome name="sign-in" size={22} color={"white"} />
                        <Text style={styleSheet.text4}>Sign In</Text>
                    </Pressable>

                    <Pressable
                        style={styleSheet.pressable2} onPress={
                            () => {
                                router.push("/signup");
                            }}>

                        <Text style={styleSheet.text5}>New User? <Text style={{ color: "blue" }}>Create New Account</Text></Text>
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
        justifyContent: "center",
    },

    image1: {
        marginTop: 10,
        borderRadius: 100,
        width: 350,
        height: 350,
        alignSelf: "center",
        marginBottom: -40,
    },

    round1: {
        backgroundColor: "white",
        borderRadius: 100,
        width: 100,
        height: 100,
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#f9477a",
    },

    text1: {
        alignSelf: "center",
        fontSize: 25,
        fontFamily: "Montserrat-Bold",
        marginBottom: 10,
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
    text6: {
        fontSize: 35,
        fontFamily: "LilitaOne-Regular",
        color: "#b21341",
        alignSelf: "center",
    },

    input1: {
        width: "100%",
        height: 45,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 100,
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
