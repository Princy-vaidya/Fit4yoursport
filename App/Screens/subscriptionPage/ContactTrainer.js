import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, Image, TouchableOpacity, SafeAreaView ,ScrollView} from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import { getUserId, getToken } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import Network from '../../Services/Network';
import { setDisplayName } from 'recompose';
import {useFocusEffect} from '@react-navigation/native';


export default function ContactTrainer({ navigation, route }) {
  const [trainerList, setTrainerList] = useState([]);
  const [trainerId, setTrainerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [startTime, setStarttime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subscribed, setSubscribed] = useState([])
  const [appointment, setAppointment] = useState([]);
  const [message, setMessage] = useState('')
  const [list, setList] = useState([])
  const [invalid, setInvalid] = useState(false)


  // useEffect(function () {
  //   getSubscribeTrainer()
  //    getSubscription()
  // }, [getSubscribeTrainer]);

  useFocusEffect(
    React.useCallback(() => {
      getSubscribeTrainer()
     
    }, [getSubscribeTrainer]),
  );

  const getSubscribeTrainer = async () => {

    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    console.log(id)
    Network(`/my-subscribed-trainer?` + `user_id=${id}`, 'get', '', token)
      .then(async function (response) {
        console.log('trainerlist', JSON.stringify(response));
        // alert( JSON.stringify(response))
        setLoading(false)
        if (response.response_data.docs.length != 0) {
          setList(response.response_data.docs);



          // alert(JSON.stringify(response.response_data.docs))

          console.log('nnn',JSON.stringify(response.response_data.docs))
          setTrainerList(response.response_data.docs[0].trainerDetails);
          setInvalid(false)
          setMessage('')

          const trainerId=response.response_data.docs.filter((item)=>item.trainer_id!=null)
 
          console.log(trainerId[0].trainer_id)

          console.log('link',`/get-paid-packages-list?user_id=${id}&trainer_id=${JSON.stringify(trainerId[0].trainer_id)}&subscription_type=VIDEO`)
          Network(`/get-paid-packages-list?user_id=${id}&trainer_id=${trainerId[0].trainer_id}&subscription_type=VIDEO`, 'get', '', token)
            .then(async function (data) {


              console.log('vvvv', data)
              //  if(data.subscribedPackage.length>0){


                await setSubscribed(data.subscribedPackage) 
                await setAppointment(data.appointmentTaken)
              // }
              // alert(JSON.stringify(data.appointmentTaken))

            })
            .catch(function (error) {
              console.log(JSON.stringify(error));

            });
        } else {
          setInvalid(true)
          //  setMessage('You are not subscribed customized program package')

        }

        // if(trainerList.length===0){
        //    setMessage('You are not subscribed yet')
        // }

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

 let data =list.filter((value)=>value.subscription_type==='STANDARD_PROGRAM')
 
  

    return (
      <View>
{data.length==0 &&
<Text style={{
          textAlign: 'center',
          color: COLORS.RED,
          fontFamily: FONT.FAMILY.REGULAR,
          margin: 10
        }}>
          You are not subscribed standard program package.
        </Text>}

      {item.subscription_type==='STANDARD_PROGRAM' &&
      <TouchableOpacity
        onPress={() => {navigation.navigate('standardExercise',{packageId:item.package_id}) }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 0.2,
            borderRadius: 4,
            padding: 14,
            margin: 10,
            width:'90%',
            alignSelf:'center',
            backgroundColor: COLORS.WHITE,
            alignItems: 'center',
            shadowColor: COLORS.GRAY,
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.6,
            shadowRadius: 1.32,

          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily:FONT.FAMILY.REGULAR,
              color: COLORS.BLACK,
            }}>
           {item.packageDetails._id}
                  </Text>
          <Image
            source={require('../../Assets/Auths/arrow.png')}
            style={{
              width: 25,
              height: 25,
              resizeMode: 'contain',
              tintColor: COLORS.RED,
            }}
          />
        </View>

      </TouchableOpacity>}
      </View>
      )

  }

  const returnArray = (item, itndex) => {
    
 let data =list.filter((value)=>value.subscription_type!=='STANDARD_PROGRAM')


    return (
      <View>
        
        {data.length==0 && 
  <Text style={{
        textAlign: 'center',
        color: COLORS.RED,
        fontFamily: FONT.FAMILY.REGULAR,
        margin: 10
      }}>
        You are not subscribed customized program pacakge
      </Text>}
        {item.subscription_type!=='STANDARD_PROGRAM' &&
        <View>

 
      
    <View
    style={{
      width: '85%',
      height: 170,
      borderRadius: 10,
      // elevation: 2,
      borderWidth:2,
      borderColor:COLORS.GRAY,
      marginHorizontal: 30,
      marginVertical: 10,
      // marginTop: 20,
      padding: 20,
    }}>
    <Text
      style={{
        color: COLORS.BLACK,
        fontFamily:FONT.FAMILY.SEMI_BOLD,
        fontSize: 16,
      }}>
          Personal Trainer
    </Text>
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View style={{marginStart: 4}}>
        <Text
          style={{
            color: COLORS.BLACK,
            marginTop: 20,
          }}>
              Name:
        </Text>
        <Text
          style={{
            color: COLORS.BLACK,
            marginTop: 10,
          }}>
              Day:
        </Text>
        <Text
          style={{
            color: COLORS.BLACK,
            marginTop: 10,
          }}>
              Time:
        </Text>
      </View>
      <View style={{marginStart: 20}}>
      
        <Text
          style={{
            color: COLORS.GRAY,
            marginTop: 20,
          }}>
       {item.trainerDetails.fname + " " +item.trainerDetails.lname}
        </Text>
       {(item.trainerDetails.availability && 
       item.trainerDetails.availability.start_day!=null && 
       item.trainerDetails.availability.end_day!=null)?
        <Text
          style={{
            color: COLORS.GRAY,
            marginTop: 10,
          }}>
        {item.trainerDetails.availability.start_day} - {item.trainerDetails.availability.end_day}
        </Text>:<Text
          style={{
            color: COLORS.RED,
            marginTop: 10,
          }}>
            Day details not available now.
        </Text>}
        {(item.trainerDetails.availability && 
        item.trainerDetails.availability.start_time!=null && 
        item.trainerDetails.availability.end_time!=null)?
        <Text
          style={{
            color: COLORS.GRAY,
            marginTop: 8,
          }}>
         {item.trainerDetails.availability.start_time} - {item.trainerDetails.availability.end_time}
        </Text>:<Text
          style={{
            color: COLORS.RED,
            marginTop: 10,
          }}>
             Time details not available now.
        </Text>}
      </View>

      {/* {(item.subscription_type!=='STANDARD_PROGRAM' && item) &&
       <Text style={{
        textAlign: 'center',
        color: COLORS.RED,
        fontFamily: FONT.FAMILY.REGULAR,
        margin: 10
      }}>
        You are not subscribed customized program pacakge
      </Text>} */}
    </View>
  </View>
 

 <View style={{flexDirection: 'row'}}>
    <View
      style={{
        width: '40%',
        height: 55,
        elevation: 4,
        borderRadius: 6,
        marginHorizontal: 28,
        marginTop: 20,
        marginVertical: 10,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        borderColor: COLORS.GRAY,
        borderBottomWidth: 0.5,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      }}>
         <TouchableOpacity onPress={()=>
        appointment.CHAT===true ?
         navigation.navigate('ChatUser',{trainerDetail:item.trainerDetails}):
         navigation.navigate('Appoinment',{trainerId:item.trainer_id})
      
        }>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../../Assets/Auths/chat.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
       
      </View>
      </TouchableOpacity>
    </View>
    <View
      style={{
        width: '40%',
        height: 55,
        elevation: 4,
        borderRadius: 6,
        marginTop: 20,
        marginVertical: 10,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        borderColor: COLORS.GRAY,
        borderBottomWidth: 0.5,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      }}>
        <TouchableOpacity onPress={()=>
        appointment.VIDEO===true ?
        navigation.navigate('VideoCall',{id:item.trainer_id,trainer:item})
      :navigation.navigate('Appoinment',{trainerId:item.trainer_id})}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../../Assets/Auths/video-call.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
       
      </View>
      </TouchableOpacity>
    </View>
    </View>
    </View>}
    </View>

    )
  }

  const getSubscription = async () => {
    const token = await getToken();
    const id = await getUserId();
    const trainer_Id = trainerId;
    setLoading(true)
    Network(`/get-paid-packages-list?user_id=${id}&trainer_id=${trainer_Id}&subscription_type=VIDEO`, 'get', '', token)
      .then(async function (data) {


        console.log('vvvv', data)
        //  if(data.subscribedPackage.length>0){
  alert(JSON.stringify(data))

        await setSubscribed(data.subscribedPackage)
        await setAppointment(data.appointmentTaken)

        // }


      })
      .catch(function (error) {
        console.log(JSON.stringify(error));

      });
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      {/* <View style={{flex: 0.1, paddingVertical: 16}}> */}
      <Header
        navigation={navigation}
        title="My Subscription Plan"
        type='back'
      />
      {/* </View> */}
      <Loader loading={loading} />
      <ScrollView>
      <View style={{ backgroundColor: '#949494', width: '100%'}} />
       <View style={{borderWidth:0.5,borderColor:COLORS.GRAY,width:'95%',alignSelf:'center',marginTop:10}}>
       <View
                style={{
                  borderWidth: 0.1,
                  backgroundColor: '#D8EEFF',
                  
                }}>
      <Text
      style={{
        color: COLORS.BLACK,
      fontFamily:FONT.FAMILY.SEMI_BOLD,
        fontSize: 18,
        margin:10,
      }}>
         1. Customized Program
    </Text>
    </View>
      {!invalid ? <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}

        renderItem={({ item, index }) => returnArray(item, index)} />
        :
        <Text style={{
          textAlign: 'center',
          color: COLORS.RED,
          fontFamily: FONT.FAMILY.REGULAR,
          margin: 10
        }}>
          You are not subscribed customized program package.
        </Text>}

        </View>

        <View style={{borderWidth:0.5,borderColor:COLORS.GRAY,width:'95%',alignSelf:'center',marginTop:20}}>
       <View
                style={{
                  borderWidth: 0.1,
                  backgroundColor: '#D8EEFF',
                  
                }}>
        <Text
      style={{
        color: COLORS.BLACK,
        fontFamily: FONT.FAMILY.SEMI_BOLD,
        fontSize: 18,
        margin:10,

        
      }}>
         2. Standardized Program
    </Text>
    </View>
      {!invalid ?  
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}

        renderItem={({ item, index }) => returnChatList(item, index)} />
         :
        <Text style={{
          textAlign: 'center',
          color: COLORS.RED,
          fontFamily: FONT.FAMILY.REGULAR,
          margin: 10
        }}>
                    You are not subscribed customized program package.

        </Text>} 
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}
