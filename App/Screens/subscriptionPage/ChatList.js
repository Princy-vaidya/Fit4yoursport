import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Dimensions, TextInput, FlatList, Image, SafeAreaView, StyleSheet,TouchableOpacity } from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import Moment from 'moment';
// import TabNavigation from '../../Utils/TabNavigation';
import Network from '../../Services/Network';
import {getUserId,getToken} from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import moment from 'moment';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru'
import de from 'javascript-time-ago/locale/de'
import es from 'javascript-time-ago/locale/es'

//  TimeAgo.addDefaultLocale(en)

export default function Chat({ navigation }) {
const [chatList,setChatList]=useState([]);
const [loading,setLoading]=useState(false)
const [invalid,setInvalid]=useState(false);
const [message,setMessage]=useState('')
  
useEffect(function () {
getChatList(); 
  }, []);

  
const getChatList = async () => {

    const id = await getUserId()
    const token = await getToken()
     setLoading(true)
      
    Network(`/get-chat-user-list?` + `trainer_id=${id}&page=0&limit=10`, 'get', '', token)
      .then(async function (data) {
        setLoading(false)
        console.log('jj',data.response)

        if(data.response ===undefined){
          setInvalid(true);
          setMessage('None of the user started chat yet.')
        }

        if(data.response.length!=0){
        const chatList=data.response;
        setInvalid(false);
        setMessage('')
       
        await setChatList(chatList);
        }else{
            setInvalid(true);
            setMessage('None of the user started chat yet.')
           
        }

       
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
       
      });
  };


    const returnChatList = (item, index) => {
        // const timeAgo = new TimeAgo('en-US')
        //  const prevDate=timeAgo.format(new Date(item.userLastChat[0].createdAt))
        // const prevDate=timeAgo.format(new Date())
        console.log(new Date());
      
        return (
          <TouchableOpacity style={styles.chatView}
          onPress={()=>navigation.navigate('Chat',{chat:item})}>
              <View style={{flexDirection:'row',width:'70%'}}>
              <Image source={ (item.userDetails.profile_image===''||item.userDetails.profile_image==null)
                ?
                require('../../Assets/Auths/user.png') :
               {uri:'https://fit4yoursport.dk:1446/'+item.userDetails.profile_image}}
              style={styles.profilepic}/>
             <View style={{marginLeft:15}}>
                 <Text style={{
                     fontSize:FONT.SIZE.LARGE,
                    fontFamily:FONT.FAMILY.SEMI_BOLD}}>
                        {item.userDetails.fname + " " + item.userDetails.lname} 
                    </Text>
                    
                 <Text style={{fontSize:FONT.SIZE.SMALL,
                    fontFamily:FONT.FAMILY.REGULAR,
                    color:COLORS.GRAY}}>
                        {item.userLastChat[0].message}</Text>
             </View>
             </View>
             <View style={{width:'30%',alignItems:'flex-end'}}>
             <Text style={{fontSize:FONT.SIZE.SMALL,
                    fontFamily:FONT.FAMILY.REGULAR,
                    color:COLORS.GRAY,}}>{moment.utc(item.userLastChat[0].createdAt).local().startOf('seconds').fromNow()}</Text>
                    </View>

           </TouchableOpacity>)
    }

    

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#f3f3f3",
                alignItems:'center'
            }}
        >
                <Header
                type='menu'
                title='Chat List'
                navigation={navigation} />
                
                <View style={{width:'95%'}}>
                <Loader loading={loading} />

         {!invalid ? <FlatList
          data={chatList}
          keyExtractor={(item, index) => index.toString()}
        
          renderItem={({ item, index }) => returnChatList(item, index)} />
          :
            <Text style={{
              textAlign: 'center',
              color: COLORS.RED,
              fontFamily: FONT.FAMILY.REGULAR,
              margin: 10
            }}>
              {message}
              </Text>}
          </View>
           
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
    chatView:{
        flexDirection:'row',
        padding:7,
        marginTop:10,
        backgroundColor:COLORS.WHITE,
        borderRadius:7,
        alignItems:'flex-start',
        padding:10
    },
    profilepic:{
        width:55,
        height:55,
         backgroundColor:COLORS.GRAY
    }
   
});
