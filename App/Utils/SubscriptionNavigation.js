import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {COLORS, WIDTH} from './constants';
import {Image} from 'react-native';
import StandardProgram from '../Screens/subscriptionPage/StandardProgram';
import CustomizedProgram from '../Screens/subscriptionPage/CustomizedProgram';

const Tab = createMaterialTopTabNavigator();

export default function MyTopTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: 'red',
          marginBottom: 10,
        },
        tabStyle: {width: WIDTH / 2},
        labelStyle: {
          fontSize: 10,
          color: COLORS.GRAY,
        },
        style: {
          backgroundColor: '#00000000',
        },
      }}>
      <Tab.Screen
        name="StandardProgram"
        component={StandardProgram}
        options={{
          tabBarLabel: 'Standard Programs',
          tabBarIcon: () => (
            <Image
              source={require('../Assets/Auths/home.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.GRAY,
                resizeMode: 'contain',
                marginTop: 5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CustomizedProgram"
        component={CustomizedProgram}
        options={{
          tabBarLabel: 'Customized Programs',
          tabBarIcon: () => (
            <Image
              source={require('../Assets/Auths/shout.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.GRAY,
                marginTop: 5,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
