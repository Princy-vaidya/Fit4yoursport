import React, {useState} from 'react';
import {View, Text, Dimensions, FlatList,SafeAreaView} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import SubscriptionNavigation from '../../Utils/SubscriptionNavigation';

export default function Subscription({navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <View style={{backgroundColor: '#949494', width: '100%', height: 0.5}} /> */}
      <Header 
      title='Subscription'
      type='menu'
      navigation={navigation}
      onPress={navigation}/>
      <SubscriptionNavigation />
    </SafeAreaView>
  );
}
