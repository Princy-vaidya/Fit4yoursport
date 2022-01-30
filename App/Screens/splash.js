import React, {useEffect, useState} from 'react';
import {View, Text, ImageBackground, StyleSheet,StatusBar} from 'react-native';
import {COLORS, HEIGHT, WIDTH} from '../Utils/constants';
import {useSelector, useDispatch} from 'react-redux';
import {getSessionKey, getUserType} from '../Utils/Preference';

export default function Splash({navigation}) {
  let isSignin = false;

  useEffect(() => {
  //  checkLogin();
  });

  const checkLogin = async () => {
    isSignin = await getSessionKey();
    userType= await getUserType();
    console.log('hh', isSignin)

    if (isSignin == 'false' || isSignin == null) {
      navigation.replace('Login');
    } else {
      if(userType==='user'){
      navigation.replace('DrawerScreen');
      }
      if(userType==='trainer'){
      navigation.replace('DashboardTrainerStack');
      }
    }
  };

  return (
    <>
    <View style={{
     
      backgroundColor:'white'
   }}>
     <StatusBar
       barStyle="dark-content" 
       backgroundColor='#19214A'
       
     />
   </View>
    <ImageBackground
      resizeMode="cover"
      source={require('../Assets/Splash1.jpg')}
      style={styles.container}>
      <Text></Text>
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: HEIGHT,
    // width: WIDTH,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
