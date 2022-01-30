import React, {useEffect, useState} from 'react';
import {View,SafeAreaView, Text, Image, StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import { COLORS, FONT } from '../../Utils/constants';
import Header from '../../Utils/Header';
import {getUserId,getToken,getUserType,setNotifyCount} from '../../Utils/Preference';
import Toast from 'react-native-simple-toast';
import Network from '../../Services/Network';
import Moment from 'moment';
import Loader from '../../Components/Common/Loader';
import { saveUserNotification } from '../../redux/actions/saveNotifyAction';
import {connect} from 'react-redux';

function Notification({navigation,route,saveUserNotification}) {
const [notification,setNotification]=useState([])
const [message,setMessage]=useState('');
const [invalid,setInvalid]=useState(false);
const [loading,setLoading]=useState(false);
const [page,setPage]=useState(1);
const [limit,setLimit]=useState(20);
const [isNext,setIsNext]=useState(false)


const isFocussed=navigation.isFocused();
useEffect( function () {
  
  if(isFocussed){
    getNotification()
  }

}, [isFocussed]);



  const getNotification=async()=>{
    const id = await getUserId()
    const token = await getToken();
    const userType = await getUserType();

    const endUrl=userType==='user'?
    `/user-notification-list?user_id=${id}&page=${page}&limit=${limit}`:
    `/user-notification-list?trainer_id=${id}&user_type=trainer&page=${page}&limit=${limit}`

    
    setLoading(true)

    Network(endUrl, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setLoading(false)
      
        var userDetails = {};
        userDetails.notification = response.response_data.total_unread_msg
         saveUserNotification(userDetails)
        // alert( props.reduxSaveUserDetail(userDetails))
        // alert(response.response_data.total_unread_msg)
      // console.log('notify',this.props.reduxSaveUserDetail(userDetails))
        if( response.response_data.docs.length>=0){
         console.log('not',response.response_data.doc)
          if(page===1){
          setNotification(response.response_data.docs)
          }else{
            setNotification([...notification,...response.response_data.docs])
          }
          setInvalid(false)
          setMessage('');
          let notify=(response.response_data.total_unread_msg);
      //  await setNotifyCount(notify)
         
      }
      if( response.response_data.docs.length==0){
        setInvalid(true)
        setMessage('Notification not found.')
       
        }

      })
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });
  }

const  LoadMoreRandomData = () =>{
  setPage(page+1);
  getNotification()
    }

const deleteNotification=async(Id)=>{
  const token = await getToken();

  let formData = new FormData();
      formData.append('_id', Id);

      Network('/delete-notification', 'post', formData, token)
        // .then(async (res) => {
        .then((res) => {
          console.log(JSON.stringify(res));
          Toast.show(res.response_message);
          getNotification();
        })

        .catch((error) => {
          Toast.show(res.response_message);
        });
}

  const onNotificationPress=async(item)=>{
    console.log('notify',item)
  
    const token = await getToken()
    const userType = await getUserType();

    Network(`/user-notification-list?_id=${item._id}`, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        })
      .catch(function (error) {
      
        console.log(JSON.stringify(error));
      });
      
     
if(item.notification_type === 'GOAL'){
  navigation.navigate('MyGoal')
  }

  if(item.notification_type === 'SUBSCRIPTION')
  {
    navigation.navigate('PaymentHistory')
  }

  if(item.notification_type === 'APPOINTMENT')
  {
    navigation.navigate('TrainerDashboard')
  }
 getNotification()


 }


  

 const  renderRow = ({ item,index}) => {
        return (
          <TouchableOpacity onPress={() => onNotificationPress(item)}
          // style={{backgroundColor:'rgba(52,52,52,0.2)'}}
          >
            <View style={[styles.outer,item.read_status==="no"?
            { backgroundColor:'rgba(52,52,52,0.2)'}:
            { backgroundColor:COLORS.WHITE}]}>
              <View style={{ flexDirection: "row", }}>
                <View style={{ width: '20%' }}>
                  <Image style={styles.notifyImage}
                    source={require('../../Assets/Auths/user.png')} 
                    style={{width:35,height:35,tintColor:COLORS.RED}}/>
                </View>
                <View style={[styles.inner, { width: '70%' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: COLORS.BLACK,fontFamily:FONT.FAMILY.SEMI_BOLD }}>
                      {(item.trainerDetails.fname==undefined && item.trainerDetails.lname==undefined)?
                      'NA':
                      item.trainerDetails.fname + " " +item.trainerDetails.lname}</Text>
                    <Text style={{ color:COLORS.GRAY, width:'80%',marginLeft:20 }}>
                      {Moment(item.createdAt).format('DD MMM YYYY hh:mm A')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{width:'90%'}}>
                  <Text
                    numberOfLines={3}
                    style={styles.notifyTitle}>
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={styles.notifyName}>
                    {item.message}
                  </Text>
                  </View>
                  <TouchableOpacity 
                  style={{alignSelf:'center',backgroundColor:COLORS.PRIMARY,borderRadius:15}}
                  onPress={()=>deleteNotification(item._id)}>
                    <Text style={{padding:8,color:'white'}}>Delete</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      }

  return (
    <SafeAreaView
      style={styles.container}>
        <Header
        title='Notification'
        type='back'
        navigation={navigation}
        onNotificationPress={navigation} />
          {invalid &&
           <Text style={{textAlign:'center',
                  color:COLORS.RED,
                  fontFamily:FONT.FAMILY.REGULAR,
                  margin:10}}>
                    {message}
                    </Text>}
     <Loader loading={loading}/>
   
      <FlatList
        data={notification}
        renderItem={(item, index) => renderRow(item,index)}
        keyExtractor={(item, index) => String(index)}
        onEndReached={()=>
          LoadMoreRandomData()}
      />
   


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
   flex:1
  },

  outer: {
    flexDirection: 'column',
    width: '94%',
    margin: 10,
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 0.5,
    top: 10,
    padding: 10,
  
  },

  notifyTitle: {
    fontSize:FONT.SIZE.MEDIUM,
    marginTop: 5,
    marginBottom: 5,
    marginLeft:-5,
    fontFamily:FONT.FAMILY.BOLD,
    color:COLORS.BLACK
  },

  notifyName: {
    fontSize:FONT.SIZE.MEDIUM,
    marginTop: 5,
    marginBottom: 5,
    marginLeft:-5,
    fontFamily:FONT.FAMILY.REGULAR,
   
  },
});
// const mapDispatchToProps = (dispatch) => {
//   return {
//     reduxSaveUserDetail: (userDetails) =>
//       dispatch(saveUserNotification(userDetails))
//   }
// }

export default connect(null,{saveUserNotification})(Notification);