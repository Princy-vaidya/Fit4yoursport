import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TextInput, FlatList, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, StyleSheet } from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import Moment from 'moment';
import { getToken, getUserId } from '../../Utils/Preference';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import Loader from '../../Components/Common/Loader';

import io from "socket.io-client";
const socket = io("https://fit4yoursport.dk:1446/")



export default function ChatUser({ navigation, route }) {

    const [messages, setMessages] = useState([]);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [froms, setFrom] = useState('');
    const [textMessage, setTextMessages] = useState('');
    //  const [socket,setSocket]=useState(io(ENDPOINT));
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [statusOnline, setStatusOnline] = useState(false);


    let flatList = useRef()




    const isFocussed=navigation.isFocused();


    useEffect(function () {
     
       if(isFocussed){
        getOnChatDetail()
         getUserChatList();
         chatList();
        
       } 

    }, [isFocussed]);



    const getOnChatDetail = async () => {
        const fromUser = await getUserId();
        // alert(fromUser)
        const toUser = route.params.trainerDetail._id;
        setFrom(fromUser)
        let data = {
            from_user: fromUser,
            to_user: toUser,
        }
        socket.emit("user-join", data);

        socket.on('online-user', function (list) {
            console.log('socket online data==>', list);
        });

        socket.on('chat-list', function (message) {
            console.log('socket on data==>', message);
            if (message.response_code === 2000) {
                setMessages(message.response_data.docs.reverse())
            }
        });
    }
    

    const getUserChatList = async () => {
        const authToken = await getToken();
        const fromUser = await getUserId();
        const toUser = route.params.trainerDetail._id;
        let formData = new FormData();

        formData.append('from_user', fromUser);
        formData.append('to_user', toUser);

        setLoading(true)
        Network('/get-user-chat', 'post', formData, authToken)
            // .then(async (res) => {
            .then((res) => {

                setLoading(false)
                if (res.response_code === 2000) {
                    const messageList = res.response_data.docs.reverse()
                    setMessages(messageList)
                    console.log('kk', messages)
                }
            })

            .catch((error) => {
                 Toast.show(res.response_message);
            });

    }

    const chatList = () => {
        socket.on('chat-list', function (message) {
            console.log('socket on data==>', message);
            setMessages(message.response_data.docs.reverse())

        });
    }

    const onSendMessage = async () => {
        const fromUser = await getUserId();
        const toUser = route.params.trainerDetail._id;
        let data = {
            to_user: toUser,
            from_user: fromUser,
            message: textMessage,
        }

        console.log('data', data)
        socket.emit("send-message", data)
        setTextMessages('')

        socket.on('chat-list', function (message) {
            console.log('socket on data==>', message);
            if (message.response_code === 2000) {
                setMessages(message.response_data.docs.reverse());
                console.log('msg arr',messages)
            }
        });

    }

    const removeUser = async () => {
        const fromUser = await getUserId();
        const toUser = route.params.trainerDetail._id;
        let data = {
            from_user: fromUser,
            to_user: toUser,
        }
        console.log('ff', data)
        socket.emit("remove-user", data);
        navigation.goBack();
        getUserChatList()
    }

    const _renderMessageRow = (item, index) => {
        // console.log('from',item)
        return (
            <View
                style={{
                    flexDirection: "row",
                    // width: "60%",
                   
                    alignSelf:
                        item.from_user === froms ? "flex-end" : "flex-start",
                    backgroundColor:
                        item.from_user === froms ? "lightgrey" : "#E6B0AA",
                    borderTopLeftRadius: item.from_user === froms ? 15 : 0,
                    borderBottomRightRadius: item.from_user === froms ? 0 : 15,
                    borderTopRightRadius: item.from_user === froms ? 15 : 15,
                    borderBottomLeftRadius: item.from_user === froms ? 15 : 15,
                    borderRadius: 5,
                    marginBottom: 10,
                    marginLeft:item.from_user === froms ? 50 : 0,
                     marginRight:item.from_user === froms ? 0 :50
                }}
            >
                <View style={{ padding: 10, justifyContent: 'space-between' }}>
                    <Text style={{
                        color: COLORS.BLACK,
                        fontSize: FONT.SIZE.SMALL,
                        fontFamily: FONT.FAMILY.SEMI_BOLD,
                    }}>
                        {item.text}
                    </Text>

                    <Text style={{
                    color: COLORS.BLACK,
                    fontSize: 10,
                    padding: 5,
                    alignSelf: 'flex-end',
                    fontFamily: FONT.FAMILY.REGULAR
                }}>
                    {Moment(item.createdAt).format('h:mm A')}
                </Text>

                </View>
               

            </View>
        );
    }





    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#f3f3f3"
            }}
        >
            <Header
                type='chatback'
                title='Chat'
                onBack={removeUser} />

            <Loader loading={loading} />

            <View style={styles.chatView}>
                <View style={{ flexDirection: 'row', width: '50%',alignItems:'center' }}>
                    <Image source={{uri:route.params.trainerDetail.profile_image}}
                        style={styles.profilepic} />
                    <Text style={styles.name}>
                        {route.params.trainerDetail.fname + ' ' + route.params.trainerDetail.lname}
                    </Text>
                    <View style={[{ width: 10, height: 10, borderRadius: 10 }, statusOnline ? { backgroundColor: 'green' } : { backgroundColor: 'red' }]} />

                </View>

                <TouchableOpacity style={{ alignItems: 'flex-end', width: '50%' }}
                    onPress={() => navigation.navigate('VideoCall')}>
                    <Image source={require('../../Assets/Auths/video-call.png')}
                        style={styles.videopic} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                style={{ margin: 10 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => _renderMessageRow(item, index)}
                ref={ref => (flatList = ref)}
                onLayout={() => flatList.scrollToEnd({ animated: true })}
                onContentSizeChange={() =>
                    flatList.scrollToEnd({ animated: true })
                }
                // contentContainerStyle={{marginBottom:200}}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                // keyboardVerticalOffset={+76}
            >
                <View style={styles.bottom}>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        style={styles.input}
                        value={textMessage}
                        placeholder="Message..."
                        onChangeText={(text) => setTextMessages(text)}
                    />
                    <TouchableOpacity
                        style={styles.btntxt}
                        onPress={() =>
                            onSendMessage()
                        }
                    >
                        <Image style={styles.sendicon} source={require('../../Assets/Auths/arrow.png')} />
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    input: {
        padding: 10,
        paddingTop:15,
        flex: 1,
        height: 60
    },
    btntxt: {
        alignSelf: "center",
        alignContent: "flex-end",
        margin: 10
    },
    headerImage: {
        borderWidth: 1,
        borderColor: "grey",
        height: 30,
        width: 30,
        resizeMode: "contain",
        // borderRadius: 50,
        margin: 10
    },
    date: {
        color: "black",
        textAlign: "center",
        fontSize: 16,
        marginTop: 30,
        padding: 5
    },
    bottom: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        elevation: 0.5,
        backgroundColor: "white"
    },
    sendicon: {
        height: 30,
        width: 30,
        resizeMode: "contain"
    },
    profilepic: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.GRAY,
        // marginVertical:8,
        marginLeft: 10
    },
    chatView: {
        minHeight: 50,
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.GRAY

    },
    name: {
        margin: 10,
        fontSize: FONT.SIZE.MEDIUM,
        fontFamily: FONT.FAMILY.SEMI_BOLD
    },
    videopic: {
        width: 35,
        height: 35,
        marginRight: 10
    }
});




