import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
StyleSheet,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Platform,
  SafeAreaView,
  Image,
  Linking,
  
  
} from 'react-native';
import Header from '../../Utils/Header';
import{getUserId,getToken,getUserType,getUserName} from '../../Utils/Preference';
import { HEIGHT, WIDTH, COLORS, GAP, FONT } from '../../Utils/constants';
import Share, {ShareSheet, Button} from 'react-native-share'
import { useReducer } from 'react';

export default function InviteGuest(props){
  const [userId,setUserId]=useState('');
  const [tokenId,setToken]=useState('');
  const [userType,setUserType]=useState('');
  const [userName,setUserName]=useState('')


useEffect(
  function () {
    token();
  },[userId,tokenId,userType,userName]
);

  


const token = async () => {
  
    const token = await getToken();
    const id = await getUserId();
    const userType=await getUserType();
    const username=await getUserName()
   
     setToken(token)
    setUserId(id);
    setUserType(userType)
    setUserName(username)
  }


   const shareLink = async ( ) => {
    const shareInfo = {
      title:'Fit4yoursport',
      subject:"Share Link",
      url: `Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}`,
    };
  
    const shareResponse = ShareCustoms.open(shareInfo)
      .then(res => ({ error: '', payload: res, success: true }))
      .catch(err => ({ error: (err && err.error) || 'User did not share', payload: {}, success: false }));
      console.log('ggg',shareResponse)
    return shareResponse;

    
  };

  const linking = {
    prefixes: ["Fit4yoursport://"],
    screens: {
      DrawerScreen: {
      path: "DrawerScreen",
      parse: {
        id: userId,
      },
    },
  }
  };
  
  console.log('url link',`Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}`)

  

  return (
    <SafeAreaView style={styles.container}>

        <Header
          navigation={props.navigation}
          title='Invite Guest'
          type='back'
         />
      {/* <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}> */}
<View style={styles.socialView}>
     
       <TouchableOpacity  onPress={()=>
       Platform.OS==='android'
?          (
            setTimeout(() => {
              Share.shareSingle( {
                
                title: "Fit4yoursport",
              message: `Lets check ${userName} activity`,
              // url:"http://facebook.github.io/react-native/",
              url: Platform.OS==='ios' ? `Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}`:`https://www.google.com/Fit4yoursport/${userId}/${tokenId}/${userType}`,
              subject: "Share Link",
              social:'whatsapp'
              })
            },300)):
             (Linking.openURL('whatsapp://send?text=' + `Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}` ))
            // shareLink()
            
           }
           style={{padding:5,borderWidth:3,borderColor:COLORS.LIGHTGRAY}}>
         <Image source={{uri:WHATSAPP_ICON}} style={{width:70,height:70}}/>
       </TouchableOpacity>
      
       <TouchableOpacity 
         onPress={()=>

          Platform.OS==='android' ?
          (
          setTimeout(() => {
            Share.shareSingle( {
              
              title: "Fit4yoursport",
            message: `Lets check ${userName} activity`,
            url: Platform.OS==='ios' ? `Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}`:`https://www.google.com/Fit4yoursport/${userId}/${tokenId}/${userType}`,
            subject: "Share Link",
            social:'email'
            })
          },300)):(
            Linking.openURL(`mailto:?subject=SendMail&body=Fit4yoursport://DrawerScreen/${userId}/${tokenId}/${userType}`) 
          )
         }
         style={{padding:5,borderWidth:3,borderColor:COLORS.LIGHTGRAY}}>
         <Image source={{uri:EMAIL_ICON}} style={{width:70,height:70}}/>
       </TouchableOpacity>
        
</View>
       
    </SafeAreaView>
  );
// }
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  
  backgroundColor: 'white',
},
instructions: {
  marginTop: 20,
  marginBottom: 20,
},
socialView:{
  flexDirection:'row',
alignSelf:'center',
padding:20,
borderWidth:3,
width:'70%',
justifyContent:'space-evenly',
marginTop:20,
borderColor:COLORS.LIGHTGRAY
}
});



//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,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";


//  email icon
const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";


