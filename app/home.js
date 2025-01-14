import { LinearGradient } from "expo-linear-gradient";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

export default function home() {

    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "DancingScript-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
        "LilitaOne-Regular": require("../assets/fonts/LilitaOne-Regular.ttf"),
    });

    useEffect(() => {
        async function fetchData() {

            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);

            let response = await fetch(process.env.EXPO_PUBLIC_URL + "/HappyChat/LoadHomeData?id=" + user.id);

            if (response.ok) {
                let json = await response.json();

                if (json.success) {
                    let chatArray = json.jsonChatArray;
                    console.log(chatArray);
                    setChatArray(chatArray);
                }
            }
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

    return (
        <LinearGradient colors={["rgba(244, 52, 151, 0.8)", "transparent"]} style={styleSheet.view1}>
            <StatusBar hidden={true} />

            <View style={styleSheet.topBar}>

                <View style={styleSheet.logoView}>
                    <Text style={styleSheet.textLogo}>HappyChat</Text>
                </View>

                <View style={styleSheet.barIcon}>
                    <Feather name="camera" size={24} color="black" />
                    <Feather name="search" size={24} color="black" />

                    <Pressable
                        style={styleSheet.pressable2} onPress={
                            () => {
                                router.push("/profile");
                            }}>

                        <FontAwesome5 name="user-circle" size={24} color="black" />
                    </Pressable>
                </View>

            </View>

            <FlashList
                data={getChatArray}
                renderItem={
                    ({ item }) =>

                        <Pressable style={styleSheet.view5} onPress={
                            () => {
                                router.push(
                                    {
                                        pathname: "/chat",
                                        params: item
                                    }
                                );
                            }
                        }>

                            <View>
                                <View style={styleSheet.view6_2}>
                                    {
                                        item.avatar_image_found ?
                                            <Image
                                                style={styleSheet.image1} source={process.env.EXPO_PUBLIC_URL + "/HappyChat/AvatarImages/" + item.other_user_mobile + ".png"}
                                            />
                                            :
                                            <Text style={styleSheet.text7}>{item.other_user_avatar}</Text>
                                    }

                                </View>
                                <View style={item.other_user_status == 1 ? styleSheet.dot_1 : styleSheet.dot_2}></View>
                            </View>


                            <View style={styleSheet.view4}>
                                <Text style={styleSheet.text4}>{item.other_user_names}</Text>
                                <Text style={styleSheet.text5} numberOfLines={1}>{item.message}</Text>

                                <View style={styleSheet.view7}>
                                    <Text style={styleSheet.text6}>{item.dateTime}</Text>
                                    <Ionicons name="checkmark-done-sharp" size={15} color={item.chat_status_id == 1 ? "blue" : "white"} />
                                </View>
                            </View>
                        </Pressable>
                }
                estimatedItemSize={200}
            />

        </LinearGradient>
    );
}

const styleSheet = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e4e4",
    },

    logoView: {
        width: "50%",
    },

    dot_1: {
        width: 16,
        height: 16,
        backgroundColor: "#3ad41e",
        position: "absolute",
        borderRadius: 30,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 46,
        marginTop: 45,
    },
    dot_2: {
        width: 16,
        height: 16,
        backgroundColor: "#f9afe2",
        position: "absolute",
        borderRadius: 30,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 46,
        marginTop: 45,
    },

    barIcon: {
        flexDirection: "row",
        columnGap: 25,
        width: "50%",
        justifyContent: "flex-end",
    },

    textLogo: {
        fontSize: 25,
        fontWeight: "bold",
    },

    view1: {
        flex: 1,
        paddingVertical: 25,
        paddingHorizontal: 25,
        paddingTop: 50,
    },

    view2: {
        flexDirection: "row",
        columnGap: 20,
        alignItems: "center",
        borderBottomWidth: 1,
    },

    view3: {
        width: 80,
        height: 80,
        backgroundColor: "white",
        borderRadius: 50,
        marginBottom: 10,
    },
    view4: {
        flex: 1,
    },
    text1: {
        fontFamily: "LilitaOne-Regular",
        fontSize: 20,
    },
    text2: {
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
    },
    text3: {
        fontFamily: "Montserrat-Bold",
        fontSize: 12,
        alignSelf: "flex-end"
    },
    view5: {
        flexDirection: "row",
        marginVertical: 10,
        columnGap: 10,
    },
    view6_1: {
        width: 60,
        height: 60,
        backgroundColor: "white",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "white",
        justifyContent: "center",
    },
    view6_2: {
        width: 65,
        height: 65,
        backgroundColor: "white",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "white",
        justifyContent: "center",
    },
    text4: {
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
    },
    text5: {
        fontSize: 15,
    },
    text6: {
        fontSize: 12,
    },
    text7: {
        fontSize: 17,
        fontFamily: "Montserrat-Bold",
        alignSelf: "center",
    },
    scrollView1: {
        marginTop: 20,
    },
    view7: {
        flexDirection: "row",
        marginVertical: 1,
        columnGap: 10,
        alignItems: "center",
        alignSelf: "flex-end",
    },

    image1: {
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: "center",
        alignSelf: "center"
    }

});