import React, {useState} from 'react';
import {View, Text, Image, Dimensions,SafeAreaView} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH} from '../../Utils/constants';
import ProgramNavigation from '../../Utils/ProgramNavigation';

export default function Program({navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header
           navigation={navigation}
          title={'Workout Program'}
          type='menu'
          onPress={navigation}
         /> 
      <ProgramNavigation />
    </SafeAreaView>
  );
}
