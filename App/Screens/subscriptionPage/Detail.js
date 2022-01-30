import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH, GAP, FONT } from '../../Utils/constants';
import Network from '../../Services/Network';
import { getToken,getUserId } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

export default function Detail(props) {
  const { navigation } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [trainerDetail, setTrainerDetail] = useState(0);
const [profile,setProfile]=useState('');
const [fname,setFname]=useState('');
const [lname,setLname]=useState('');
const [dob,setDob]=useState('');
const [description,setDescription]=useState('');
const [height,setHeight]=useState('');
const [weight,setWeight]=useState('');
const [monthlyFee,setMonthlyFee]=useState('')
const [chatFee,setChatFee]=useState('')
const [callFee,setCallFee]=useState('')
const [video,setVideo]=useState(false)
const [chat,setChat]=useState(false)
const [subscribed,setSubscribed]=useState([])
const [appointment,setAppointment]=useState([])



  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState('');
  

  


  useFocusEffect(
    React.useCallback(() => {
      getChatList();
      getSubscription();
    }, []),
  );

  const getChatList = async () => {
    const token = await getToken()
    setLoading(true)
    Network(`/list-all-trainer?page=1&limit=10&user_type=trainer&_id=${props.route.params.trainerDetail._id}`, 'get', '', token)
      .then(async function (data) {

        if (data.response_code === 2000) {
          // if(data.response_code.docs.length!=''){
               
          setLoading(false)
          setTrainerDetail(data.response_data.docs)
          setProfile(data.response_data.docs[0].profile_image);
          setFname(data.response_data.docs[0].fname);
          setLname(data.response_data.docs[0].lname);
          setDob(data.response_data.docs[0].dob);
          setDescription(data.response_data.docs[0].description);
          setHeight(data.response_data.docs[0].height);
          setWeight(data.response_data.docs[0].weight);
          setMonthlyFee(data.response_data.docs[0].monthly_fees)
          setChatFee(data.response_data.docs[0].chat_fees)
          setCallFee(data.response_data.docs[0].video_call_fees)

          console.log('value',data.response_data.docs)
          // alert(JSON.stringify(trainerDetail))
          setInvalid(false);
          setMessage('')
          //  }else{
          //   setInvalid(true);
          //   setMessage('Trainer list not found.')
          //  }
        }
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));

      });
  };

  const getSubscription = async () => {
    const token = await getToken();
    const id=await getUserId();
    setLoading(true)
    Network(`/get-paid-packages-list?user_id=${id}&trainer_id=${props.route.params.trainerDetail._id}&subscription_type=VIDEO`, 'get', '', token)
      .then(async function (data) {
   
       await  setSubscribed(data.subscribedPackage)
       await  setAppointment(data.appointmentTaken)
      
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));

      });
  };


 

  const returnPlanList = (item, index) => {
    return (

      <View>
        <Text style={styles.listText}>
          {index + 1}. {item}
        </Text>
      </View>
    )

  }




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <Header
        type='back'
        title='Coach Details'
        navigation={navigation} />
      <Loader loading={loading} />


      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>

        

     </View>
        <View
          style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ width: 50, height: 45, alignItems: 'center' }}>
              <Image source={(profile=== '' || profile == null)
                ?
                require('../../Assets/Auths/user.png') :
                { uri: 'https://fit4yoursport.dk:1446/' + profile }} style={{ width: 45, height: 45, backgroundColor: COLORS.GRAY,borderRadius:45 }} />
            </View>
            <Text style={[styles.planText, { marginHorizontal: 8 }]}>{fname} {lname}</Text>
          </View>
          <View style={{ marginTop: 10, marginBottom: 10 }}>

            {/* <FlatList
          data={planList}
          keyExtractor={(item, index) => index.toString()}
        
          renderItem={({ item, index }) => returnPlanList(item, index)} /> */}
            <View style={{ flexDirection: 'row', marginVertical: 3 }}>
              <Text style={styles.smallBoldText}>Dob</Text>
              <Text style={styles.smallRegularText}>{dob===null?'NA':moment(dob).format('YYYY-DD-MM')}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 3 }}>
              <Text style={styles.smallBoldText}>Height</Text>
              {height ?
              <Text style={styles.smallRegularText}>{height.height} {height.type}</Text>
              :<Text style={styles.smallRegularText}>NA</Text>}
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 3 }}>
              <Text style={styles.smallBoldText}>Weight</Text>
              {weight ?
              <Text style={styles.smallRegularText}>{weight.weight} {weight.type}</Text>
              :<Text style={styles.smallRegularText}>NA</Text>}
            </View>

          </View>
          <Text style={styles.planText}>${monthlyFee}/month</Text>
          {description != null ?
            <Text style={[styles.smallRegularText, { marginHorizontal: 0, marginVertical: 5 }]}>
              {description}
            </Text>
            : <Text style={[styles.smallRegularText, { marginHorizontal: 0, marginVertical: 5, color: COLORS.RED }]}>
              Description not available.
           </Text>}

          {subscribed.CUSTOMIZE_PROGRAM!=='available'  &&

          <TouchableOpacity style={styles.Button}
            onPress={() => navigation.navigate('CardFormScreen',{data:trainerDetail[0],subDesc:'TRAINER SUBSCRIPTION',subType:'CUSTOMIZE_PROGRAM'})}>
            <Text style={styles.book}>Book Coach</Text>
          </TouchableOpacity>}

        
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
            shadowRadius: 2,
          }}>
             <TouchableOpacity onPress={()=>
            //  navigation.navigate('ChatUser',{trainerDetail:trainerList})
            ((appointment.CHAT===true && subscribed.CUSTOMIZE_PROGRAM==='available')||(appointment.CHAT===true))?
            navigation.navigate('ChatUser',
            {trainerDetail:props.route.params.trainerDetail}):
            (subscribed.CUSTOMIZE_PROGRAM==='not_available' && subscribed.CHAT==='not_available') ?
            navigation.navigate('CardFormScreen',
            {subType:'CHAT',
            data:trainerDetail[0],
            subDesc:'ONE Hr CHAT SUBSCRIPTION'}):
            navigation.navigate('Appoinment',{trainerId:props.route.params.trainerDetail._id,
              subType:'CHAT'})
              // {}
            }>
          <View style={{flexDirection: 'row',     
}}>
            <Image
              source={require('../../Assets/Auths/chat.png')}
              style={{
                width: 30,
                height: 30,
               
              }}
            />

            {(subscribed.CUSTOMIZE_PROGRAM!=='available')  &&
            <Text style={{marginStart: 10, marginTop: 6}}>
              <Text style={{fontWeight: 'bold'}}> ${chatFee}</Text>
              /hr
            </Text>}
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
              // navigation.navigate('VideoCall',{id:trainerId,trainer:trainerList})}
             ((appointment.VIDEO===true && subscribed.CUSTOMIZE_PROGRAM==='available') ||(appointment.VIDEO===true))?
              navigation.navigate('VideoCall',
              {id:props.route.params.trainerDetail_id}):
            ( subscribed.CUSTOMIZE_PROGRAM==='not_available' && subscribed.VIDEO==='not_available' ) ?
            navigation.navigate('CardFormScreen',
            {subType:'VIDEO',
            data:trainerDetail[0],
            subDesc:'ONE Hr VIDEO SUBSCRIPTION'})
              :navigation.navigate('Appoinment',
              {trainerId:props.route.params.trainerDetail._id,
                subType:'VIDEO'})
              // :navigation.navigate('CardFormScreen',{subType:'VIDEO',data:trainerDetail[0],subDesc:'ONE Hr VIDEO SUBSCRIPTION')
            }>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../../Assets/Auths/video-call.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            {(subscribed.CUSTOMIZE_PROGRAM!=='available' ) && 
            <Text style={{marginStart: 10, marginTop: 6}}>
              <Text style={{fontWeight: 'bold'}}>${callFee}</Text>
              /hr
            </Text>}
          </View>
          </TouchableOpacity>
        </View>
      </View>


      {(appointment.CHAT===true)  &&
      <TouchableOpacity style={{marginTop:6}} onPress={()=>  
      navigation.navigate('ChatUser',{trainerDetail:props.route.params.trainerDetail})}>
            <Text style={{marginStart: 10, marginTop: 6}}>
              You have already taken chat appointment with this trainer 
               
              <Text style={{color:COLORS.BLUE}}> START CHAT. </Text>
            </Text>
              
              
      </TouchableOpacity>}

            {(appointment.VIDEO===true)  &&
            <TouchableOpacity style={{marginTop:6}} onPress={()=>    
            navigation.navigate('VideoCall',{id:props.route.params.trainerDetail_id})}>
            <Text style={{marginStart: 10, marginTop: 6}}>
              You have already taken call appointment with this trainer, 
               
              <Text style={{color:COLORS.BLUE}}> START CALL. </Text>
            </Text>
              
              
      </TouchableOpacity>}


        </View>
        

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  card: {
    width: '90%',
    //   height: 120,
    borderRadius: 6,
    //   elevation: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: COLORS.LIGHTGRAY
  },
  planText: {
    color: COLORS.BLACK,
    fontFamily: FONT.FAMILY.BOLD,
    fontSize: FONT.SIZE.SMALL,
    // marginLeft:20
  },
  listText: {
    fontSize: FONT.SIZE.SMALL,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    color: COLORS.GRAY,
    paddingTop: 5
  },
  Button: {
    backgroundColor: COLORS.PRIMARY, marginTop: 10, width: '40%', borderRadius: 15
  },
  book: {
    padding: 8,
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    fontSize: 14,
    alignSelf: 'center'
  },
  activeTab: {
    flex: 0.2,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: COLORS.RED
  },
  inActiveTab: {
    flex: 0.2,
    alignItems: 'center',

  },
  smallBoldText: {
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    color: COLORS.BLACK, fontSize: 14
  },
  smallRegularText: {
    fontFamily: FONT.FAMILY.REGULAR,
    color: COLORS.BLACK,
    fontSize: 14,
    marginHorizontal: 8
  }

});

