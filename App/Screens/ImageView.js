import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { getToken, getUserId, getUserType,getUserName } from '../Utils/Preference';
import Loader from '../Components/Common/Loader';
import Network from '../Services/Network';
import {connect} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
// import FastImage from 'react-native-fast-image'



const ImageView = (props) => {
  const [userImage, setUserImage] = useState('');
  





  // useEffect(
  //   function () {

  //     // setUserImage(props.userDetails.profileImage)
  //     setEnable(!enable)
  //     console.log('enable',enable)
  //     if(props.userDetails.profileImage===" "){
  //     token();
  //   //  setTimeout(() => { setEnable(false)}, 100)
  //     }else{
  //       setUserImage(props.userDetails.profileImage)
  //       setEnable(!enable)
  //     }
   
    
     
  //   },
  //   [userImage],
  // );


 
  useFocusEffect(
    React.useCallback(async() => {

     
     
      if(props.userDetails.profileImage===" "){
        // setEnable(true)
      token();
    
      }else{

        // setTimeout(() => { setEnable(!enable)}, 100)
        // setEnable(true)
        setUserImage(props.userDetails.profileImage)
        
      }
    }, [userImage]),
  );



  

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      
    
     
     
      console.log('print url',props.userDetails.profileImage)
      //  if(props.userDetails.profileImage===" "){
      getProfileData(token, id);

      
      //  }
      
    } catch (e) { }
  };

  const getProfileData = (token, id) => {
    Network('/view-profile?_id=' + id, 'get', '', token)
      .then(function (response) {
        
        setUserImage(data.profile_image);
        
      })
      .catch(function (error) {
        console.log('err', JSON.stringify(error));
      });
  };


  const ImageView=()=>{
    return(
      <Image
      source={{ uri:userImage}}
//       key={userImage}
// onLoadStart={() => setEnable(true)}
// onLoadEnd={() => setEnable(false)}
      style={{
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        // overflow: 'hidden',
        borderWidth: 2,
        borderColor:'white'
      }}
    />
    )
  }

  return (
    
    <Image
    source={{ uri:userImage}}
//       key={userImage}
// onLoadStart={() => setEnable(true)}
// onLoadEnd={() => setEnable(false)}
    style={{
      width: 100,
      height: 100,
      borderRadius: 100 / 2,
      // overflow: 'hidden',
      borderWidth: 2,
      borderColor:'white'
    }}
  />
  );
};

const styles = StyleSheet.create({
  headerViewInActive: {
    backgroundColor: 'black',
    paddingVertical: 6,
  },

  headerViewActive: {
    backgroundColor: 'red',
    paddingVertical: 6,
  },
});

const mapStateToProps = (state) => {
	return{
		userDetails: state.profileReducer.userDetails
	}
}
export default connect(mapStateToProps,null)( ImageView);