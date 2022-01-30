import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Dimensions, TextInput, FlatList, Image, SafeAreaView, StyleSheet,TouchableOpacity,ScrollView } from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import Moment, { calendarFormat } from 'moment';
// import TabNavigation from '../../Utils/TabNavigation';
import Network from '../../Services/Network';
import {getUserId,getToken,getUserType} from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import { color } from 'react-native-reanimated';
import { setIn } from 'formik';

//  TimeAgo.addDefaultLocale(en)

export default function PaymentHistory({ navigation }) {
const [userList,setUserList]=useState([]);
const [loading,setLoading]=useState(false)
const [type,setType]=useState('')
const [invalid,setInvalid]=useState(false)
const [message,setMessage]=useState('')


useFocusEffect(
   

    React.useCallback(async() => {
        const userType= await getUserType();
        if(userType==='user'){
        getPaymentList()
        }else{
            getPaymentTrainerList() 
         }
    }, []),
  );
  


  
const getPaymentTrainerList = async () => {

    const id = await getUserId()
    const token = await getToken()
    const userType= await getUserType()
  
    setType(userType)

   

     setLoading(true)
     console.log(id)

    Network(`/trainer-all-transaction-list?trainer_id=${id}&page=1&limit=10`, 'get', '', token)
      .then(async function (data) {
        setLoading(false)
        console.log('nn',data.response_data.docs.length)

        // alert(JSON.stringify(data.response_data.docs))
    //  if(data.response_data.docs.length!==[]){
        // setInvalid(false)
        // setMessage('')
    
      let userList=[];
            data.response_data.docs.map(item => {

          
                userList.push({
                  profile:item.userDetails.profile_image,
                  fname:item.userDetails.fname,
                  lname:item.userDetails.lname,
                  appointment_taken:item.appointment_taken,
                  date:item.createdAt,
                  ammount:item.amount,
                  subType:item.subscription_type,
                  trainerId:item.trainer_id
                })
                    
                
              })

    //   }
    //     // const chatList=data.response
     setUserList(userList);
    //     }else{
    //         setInvalid(true)
    //         setMessage('No Paymnet found.')
    //     }
    if(data.response_data.docs.length==0 || data.response_data.docs==[]){
        setInvalid(true)
       setMessage('No Paymnet found.')
    }
        
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const getPaymentList = async () => {

    const id = await getUserId()
    const token = await getToken()
    const userType= await getUserType()
  
    setType(userType)

   

     setLoading(true)
     console.log(id)

    Network(`/user-all-transaction-list?user_id=${id}&page=1&limit=10`, 'get', '', token)
      .then(async function (data) {
        setLoading(false)
        console.log('user',data.response_data.docs.length)
        


    //  if(data.response_data.docs.length!=0){
    //     setInvalid(false)
    //     setMessage('')
    let userList=[];
        
    data.response_data.docs.map(item => {

          
            userList.push({
              profile:item.trainerDetails.profile_image,
              fname:item.trainerDetails.fname,
              lname:item.trainerDetails.lname,
              appointment_taken:item.appointment_taken,
              date:item.createdAt,
              ammount:item.amount,
              subType:item.subscription_type,
              trainerId:item.trainer_id
            })
                
        })  
   
          
    setUserList(userList);

    if(data.response_data.docs.length==0 || data.response_data.docs==[]){
        setInvalid(true)
       setMessage('No Paymnet found.')
    }
        // }else{
        //     setInvalid(true)
        //     setMessage('No Paymnet found.')
        // }
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


    const returnChatList = (item, index) => {
        
        return (
          <TouchableOpacity style={styles.chatView}
          onPress={()=> item.appointment_taken!=='YES' && 
          navigation.navigate('Appoinment',{trainerId:item.trainerId,
            subType:item.subType})}>
              <View style={{flexDirection:'row',width:'70%'}}>
              <Image source={(item.profile===null || item.profile===undefined)
              ?
              require('../../Assets/Auths/user.png')
              :{uri:item.profile}}
              style={styles.profilepic}/>
             <View style={{marginLeft:15}}>
                 <Text style={{
                     fontSize:FONT.SIZE.LARGE,
                    fontFamily:FONT.FAMILY.SEMI_BOLD}}>
                         {item.fname + " " + item.lname}
                    </Text>
                    <View >
                    <View style={{flexDirection:'row',}}>
                    <Text style={styles.appointment}>
                      Appoinment taken:</Text>
                 <Text style={styles.appointmentType}>
                        {item.appointment_taken!=='YES'?'NO':'YES'}</Text>
                        </View>

                        <View style={{flexDirection:'row',}}>
                    <Text style={[styles.appointment,{fontFamily:FONT.REGULAR}]}>
                      Appoinment:</Text>
                 <Text style={styles.appointmentType}>
                        {item.subType}</Text>
                        </View>

                        <Text style={{fontSize:12,
                    fontFamily:FONT.FAMILY.REGULAR,
                    color:COLORS.GRAY,marginTop:5}}>{moment(item.date).format('DD MMM YYY hh:mm A')}</Text>
                     {(item.appointment_taken!=='YES'  && type==='user') && 
                    <View style={{backgroundColor:COLORS.PRIMARY,alignItems:'center',borderRadius:5,marginTop:7}}>
                        <Text style={{textAlign:'center',color:COLORS.WHITE,padding:5}}>Take Appointment</Text>
                        </View>
                      }
                        </View>
             </View>
             </View>
             {type==='user' ?
             <View style={{width:'30%',alignItems:'flex-end',}}>
                 {item.ammount &&
             <Text style={{fontSize:FONT.SIZE.LARGE,
                    fontFamily:FONT.FAMILY.SEMI_BOLD,
                    color:COLORS.BLACK,marginVertical:'12%'}}>${item.ammount}</Text>}
                   
             
                    </View>:<View style={{width:'30%',alignItems:'flex-end',}}>
               
             {item.ammount &&
                 <Text style={{fontSize:FONT.SIZE.LARGE,
                    fontFamily:FONT.FAMILY.SEMI_BOLD,
                    color:COLORS.BLACK,marginVertical:'12%'}}>${item.ammount}</Text>}
        
                    </View>
            }

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
                type='back'
                title='Payment History'
                navigation={navigation} />
                 <Loader loading={loading} />

                 {invalid ?
          <Text style={{
            textAlign: 'center',
            color: COLORS.RED,
            fontFamily: FONT.FAMILY.REGULAR,
            margin: 10
          }}>{message}</Text>:
                <ScrollView style={{width:'95%',height:'100%',marginBottom:40}}>
               
      
          <FlatList
          data={userList}
          keyExtractor={(item, index) => index.toString()}
        
          renderItem={({ item, index }) => returnChatList(item, index)} />
          </ScrollView>}
           
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
    },
    appointment:{
      fontSize:FONT.SIZE.SMALL,
          fontFamily:FONT.FAMILY.REGULAR,
        color:COLORS.BLACK,
        marginTop:5
    },
    appointmentType:{
      fontSize:FONT.SIZE.SMALL,
                    fontFamily:FONT.FAMILY.BOLD,
                    color:COLORS.GRAY,marginTop:5,marginLeft:5
    }
   
});
