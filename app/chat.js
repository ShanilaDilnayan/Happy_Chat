import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { Image, ImageBackground } from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from "expo-image-picker";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    const item = useLocalSearchParams();

    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);


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

    useEffect(
        () => {
            async function fetchChatArray() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(process.env.EXPO_PUBLIC_URL + "/HappyChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);

                if (response.ok) {
                    let chatArray = await response.json();

                    setChatArray(chatArray);
                }
            }

            fetchChatArray();

            setInterval(() => {
                fetchChatArray();
            }, 5000);

        }, []
    );

    if (!loaded && !error) {
        return null;
    }
    const coverImage = require("../assets/bg.png");
    return (

        <LinearGradient colors={["rgba(244, 52, 151, 0.8)", "transparent"]} style={styleSheet.view1}>
            <StatusBar hidden={true} />

            <View style={styleSheet.topBar}>

                <View style={styleSheet.view2}>
                    <View>
                        <View style={styleSheet.view3}>
                            {
                                item.avatar_image_found == "true"
                                    ?
                                    <Image
                                        style={styleSheet.image1} source={process.env.EXPO_PUBLIC_URL + "/HappyChat/AvatarImages/" + item.other_user_mobile + ".png"}
                                    />
                                    :
                                    <Text style={styleSheet.text1}>{item.other_user_avatar}</Text>
                            }

                        </View>
                        <View style={item.other_user_status == 1 ? styleSheet.dot_1 : styleSheet.dot_2}></View>
                    </View>
                    <View style={styleSheet.view4}>
                        <Text style={styleSheet.text2}>{item.other_user_names}</Text>
                        <Text style={styleSheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                    </View>
                </View>

                <View style={styleSheet.barIcon}>
                    <Feather name="phone-call" size={24} color="black" />
                    <Feather name="video" size={24} color="black" />
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                </View>

            </View>
            {/* <ImageBackground style={styleSheet.bg} source={coverImage} > */}
            <View style={styleSheet.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? styleSheet.view5_1 : styleSheet.view5_2}>
                                {/* <Text style={styleSheet.text3}>{item.message}</Text>
                                <View style={styleSheet.view6}>
                                    <Text style={styleSheet.text4}>{item.datetime}</Text>
                                    {
                                        item.side == "right" ?
                                            <Ionicons name="checkmark-done-sharp" size={15} color={item.status == 1 ? "blue" : "#a7a7a7"} />
                                            : null
                                    }
                                </View> */}

                                {item.message.slice(-4) === '.png' ? (<Image
                                    source={{ uri: "http://192.168.1.8:8080/HappyChat/Uploads/" + item.message }}
                                    style={styleSheet.image4}
                                />) :

                                    <><Text style={styleSheet.text3}>{item.message}</Text>
                                        <View style={styleSheet.view6}>
                                            <Text style={styleSheet.text4}>{item.datetime}</Text>
                                            {
                                                item.side == "right" ?
                                                    <Ionicons name="checkmark-done-sharp" size={15} color={item.status == 1 ? "blue" : "#a7a7a7"} />
                                                    : null
                                            }
                                        </View></>
                                }

                            </View>
                    }
                    estimatedItemSize={200}
                />

            </View>

            <View style={styleSheet.view7}>
                <Pressable style={styleSheet.pressable2} onPress={
                    async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({});

                        if (!result.canceled) {
                            setSelectedImage(result.assets[0].uri);

                            let form = new FormData();
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                            let response;

                            form.append("image", {
                                name: "upimage",
                                uri: result.assets[0].uri,
                                type: "image/png"
                            });

                            form.append("user_id", user.id);
                            form.append("other_user_id", item.other_user_id);

                            response = await fetch("http://192.168.1.8:8080/HappyChat/SendImages", {
                                method: "POST",
                                body: form,
                            });

                            if (response.ok) {
                                let json = await response.json();
                                if (json.success) {
                                    setMessage('');
                                }
                            } else {
                                console.error('HTTP error: ', response.status);
                            }

                        }

                    }} >
                    <Ionicons name="attach-sharp" size={40} color="#fa3ec4" />
                </Pressable>


                <TextInput style={styleSheet.input1} value={getChatText} placeholder={"Type a message"} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={styleSheet.pressable1} onPress={
                    async () => {

                        if (getChatText.length == 0) {

                            Alert.alert("Error !", "Please enter your message.");

                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch(process.env.EXPO_PUBLIC_URL + "/HappyChat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText)
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }
                    }
                } >
                    <FontAwesome name="send-o" size={20} color="white" />
                </Pressable>
            </View>
            {/* </ImageBackground> */}
        </LinearGradient>

    );
}

const styleSheet = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e4e4",
        paddingLeft: 20,
        paddingRight: 10,
    },
    bg: {
        flex: 1,
    },
    image4: {
        width: 200,
        height: 180,
        marginTop: 10,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'green',
        zIndex: 100,
        borderColor: 'white',
        borderWidth: 5,
        shadowColor: 'black',
        shadowOffset: { width: 100, height: 100 },
        shadowOpacity: 1,
        shadowRadius: 10,
        marginBottom: 10,
    },
    dot_1: {
        width: 16,
        height: 16,
        backgroundColor: "#3ad41e",
        position: "absolute",
        borderRadius: 30,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 40,
        marginTop: 40,
    },
    dot_2: {
        width: 16,
        height: 16,
        backgroundColor: "#f9afe2",
        position: "absolute",
        borderRadius: 30,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 40,
        marginTop: 40,
    },

    logoView: {
    },

    barIcon: {
        flexDirection: "row",
        columnGap: 25,
        width: "50%",
        justifyContent: "flex-end"
    },

    textLogo: {
        fontSize: 25,
        fontWeight: "bold",
    },
    view1: {
        flex: 1,
        paddingTop: 30,
    },
    view2: {
        marginTop: 20,
        flexDirection: "row",
        columnGap: 15,
        alignItems: "center",
        marginBottom: 10,
        width: "50%",
    },
    view3: {
        backgroundColor: "white",
        width: 55,
        height: 55,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 1,
    },

    image1: {
        width: 60,
        height: 60,
        borderRadius: 40,
    },

    text1: {
        fontSize: 25,
        fontFamily: "Montserrat-Bold",
    },

    view4: {
        rowGap: 2
    },

    text2: {
        fontSize: 20,
        fontFamily: "LilitaOne-Regular",
    },
    text3: {
        fontSize: 15,
    },
    text4: {
        fontSize: 11,
    },

    view5_1: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-end",
        rowGap: 5,
    },
    view5_2: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-start",
        rowGap: 5,
    },
    view6: {
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center"
    },
    view7: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 10,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    input1: {
        height: 45,
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 1,
        fontSize: 20,
        flex: 1,
        paddingHorizontal: 10
    },
    pressable1: {
        backgroundColor: "#fa3ec4",
        borderRadius: 50,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    pressable2: {

        borderRadius: 50,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },

    center_view: {
        flex: 1,
        marginVertical: 25,
    }

});