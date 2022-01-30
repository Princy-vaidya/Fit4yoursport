import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {COLORS, WIDTH} from './constants';
import {Image} from 'react-native';
import Exercise from '../Screens/programTabPages/Exercise';
import Videos from '../Screens/programTabPages/Videos';
import Tips from '../Screens/programTabPages/Tips';

const Tab = createMaterialTopTabNavigator();

export default function MyTopTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: 'red',
          marginBottom: 10,
        },
        tabStyle: {width: WIDTH / 3},
        labelStyle: {
          fontSize: 10,
          color: COLORS.GRAY,
        },
        style: {
          backgroundColor: '#00000000',
        },
      }}>
      <Tab.Screen
        name="Exercise"
        component={Exercise}
        options={{
          tabBarLabel: 'Exercise',
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
        name="Videos"
        component={Videos}
        options={{
          tabBarLabel: 'Videos',
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
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{
          tabBarLabel: 'Tips',
          tabBarIcon: () => (
            <Image
              source={require('../Assets/Auths/subscription.png')}
              style={{
                width: 20,
                height: 20,
                marginTop: 5,
                tintColor: COLORS.GRAY,

                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
