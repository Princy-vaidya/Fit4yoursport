import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ToastAndroid,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import {COLORS} from './constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getUserEmail, getUserType,getUserId,getToken,getNotifyCount,setNotifyCount} from '../Utils/Preference';
import Network from '../Services/Network'
import { useSelector } from 'react-redux';
import {connect} from 'react-redux';
import { saveUserNotification } from '../redux/actions/saveNotifyAction';
import AsyncStorage from '@react-native-community/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import notifyReducer from '../redux/reducers/notifyReducer';



function ReCallGroupList({getGroupsListAction = () => {}}) {
  useFocusEffect(
    React.useCallback(() => {
      getGroupsListAction();
    }, []),
  );

  return null;
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(1598051730000),
      mode: 'date',
      show: false,
      enable:false,
      // notification:'0',
       notifyCount:'0',
    };
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    this.setState({
      show: Platform.OS === 'ios',
      date: currentDate,
      userType:''
    });
  };

  showMode = (currentMode) => {
    this.setState({
      show: Platform.OS === 'ios',
      mode: currentDate,
    });
  };

  showDatepicker = () => {
    this.setState({
      mode: 'date',
      show: true,
    });
  };

  async componentDidMount(){
    this.fetchData();
    this.getNotification();

   await AsyncStorage.getItem("count").then((count) => {
      this.setState({
        notifyCount:count
      })
     
   }).done();
   

     console.log('notcOUNT',this.props.userDetails.notification)
  }


   getNotification=async()=>{
    const id = await getUserId()
    const token = await getToken()
    

    Network(`/user-notification-list?user_id=${id}&page =1&limit=20`, 'get', '', token)
      .then(async function (response) {
        
        var userDetails = {};
    userDetails.notification = response.response_data.total_unread_msg
     saveUserNotification(userDetails);

    
    //  await setNotifyCount(response.response_data.total_unread_msg)
console.log('value',response.response_data.total_unread_msg)
await AsyncStorage.setItem('count', JSON.stringify(response.response_data.total_unread_msg)) 

await AsyncStorage.getItem("count").then((count) => {

}).done();
         })
     
      .catch(function (error) {
        
        console.log(JSON.stringify(error));
      });

}



  fetchData=async()=>{
    const userType=await getUserType();
    //  const count =this.props.userDetails.notification;
    //  const notifyCount=await getNotifyCount()
    
    
     this.setState({
       userType:userType,
      //  notification:userType === 'user' && count,
      // notifyCount: userType === 'user' && notifyCount
     })

  }

  toggleDrawer=()=>{
    this.state.enable=!this.state.enable
    this.props.navigation.toggleDrawer();
  
  }

  render() {
    const { title,  navigation,type,notesAdd,onPress,onBack,onNotiificationPress} = this.props;
    return (
      <>
      <ReCallGroupList
      getGroupsListAction={this.getNotification}
    />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.headerView}>
      
           <View
             style={{
              flex: 0.1,
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 10,
            }}>
            {type == 'menu' && (
              <TouchableOpacity onPress={() => this.toggleDrawer()}>
                <Image
                  source={require('../Assets/Auths/menu.png')}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    tintColor: COLORS.BLACK,
                  }}
                />
              </TouchableOpacity>
            )}
            {type == 'back' && (
              <TouchableOpacity onPress={() =>  navigation.goBack()}>
                <Image
                  source={require('../Assets/Auths/back.png')}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    tintColor: COLORS.BLACK,
                  }}
                />
              </TouchableOpacity>
            )}
            {type == 'chatback' && (
              <TouchableOpacity onPress={()=> onBack()}>
                <Image
                  source={require('../Assets/Auths/back.png')}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    tintColor: COLORS.BLACK,
                  }}
                />
              </TouchableOpacity>
            )}
            
          </View>
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              mode={this.state.mode}
              display="default"
              value={this.state.date}
            />
          )}
          <View
            style={{
              flex: 0.8,
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.BLACK,
              }}>
              {title}
            </Text>
          </View>

          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginEnd: 20,
            }}>
              {((this.state.userType==='trainer' && notesAdd==='yes')||this.state.userType==='user') &&
            <TouchableOpacity onPress={()=>this.state.userType==='user'?
            navigation.navigate('Notes'):
            onPress()}>
              <Image
                source={require('../Assets/Auths/calendar.png')}
                style={{
                  width: 25,
                  height: 25,
                  marginEnd: 10,
                  resizeMode: 'contain',
                  tintColor: COLORS.GRAY,
                }}
              />
            </TouchableOpacity>
  }
     {
            <TouchableOpacity onPress={()=>
            navigation.navigate('Notification')
            }>
    <Image
              source={require('../Assets/Auths/Notification.png')}
              style={{
                width: 25,
                height: 25,
                marginHorizontal: 10,
                resizeMode: 'contain',
                tintColor: COLORS.GRAY,
              }}
            />
          {(this.props.userDetails.notification!=null && this.props.userDetails.notification!=0) ?
    <View style={{alignSelf:'flex-end',position:'absolute',right:3,backgroundColor:'red',borderRadius:15,bottom:10,alignItems:'center',width:20,height:20,justifyContent:'center'}}>
      <Text style={{color:'white',fontSize:12,fontWeight:'bold',textAlign:'center'}}>
        {this.props.userDetails.notification}
        </Text>

        </View> 
        : 
        (this.state.notifyCount!=0 &&  this.state.notifyCount!=null) && <View style={{alignSelf:'flex-end',position:'absolute',right:3,backgroundColor:'red',borderRadius:15,bottom:10,alignItems:'center',width:20,height:20,justifyContent:'center'}}>
      <Text style={{color:'white',fontSize:12,fontWeight:'bold',textAlign:'center'}}>
        {(this.state.notifyCount)}
        </Text>
        </View>

   }   
            
        </TouchableOpacity>}
         </View>
       </View>      


</TouchableWithoutFeedback>
</>
    );
  }
}
const styles = StyleSheet.create({
  imageMenu: {
    width: 40,
    height: 40,
    resizeMode: 'center',
  },
  headerView:{
    backgroundColor: 'white',
                    flexDirection: 'row',
                    minHeight: 50,
                    zIndex: 2,
                     borderColor:COLORS.FAINTGRAY,
                    borderBottomWidth:0.5,
                    shadowColor:COLORS.FAINTGRAY,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 1
  }
});

const mapStateToProps = (state) => {
	return{
		userDetails: state.notifyReducer.userDetails
	}
}

 export default connect(mapStateToProps, {saveUserNotification})(Header);