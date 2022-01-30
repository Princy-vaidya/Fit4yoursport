import React, {useState,useEffect} from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {COLORS, HEIGHT, WIDTH} from '../../Utils/constants';
import TrainertipNavigation from '../../Utils/TrainertipNavigation';

export default function TrainerdetailTab({navigation,route}) {
    

useEffect(function () {
    console.log('pp',route.params.fname)
    // alert(route.params.profile_image)
 }, [])

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TrainertipNavigation  
      navigation={navigation} 
      fname={route.params.fname}
      lname={route.params.lname}
      profile_image={route.params.profile_image}
      userDetailsId={route.params.userDetailsId}
      trainerId={route.params.trainerId}/>
    </View>
  );
}
