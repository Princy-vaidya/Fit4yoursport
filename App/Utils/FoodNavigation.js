import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {COLORS, WIDTH} from './constants';
import {Image} from 'react-native';
import List from '../Screens/foodtabPages/List';
import CustomFood from '../Screens/foodtabPages/CustomFood';
import MealTime from '../Screens/foodtabPages/MealTime';

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
        name="List"
        component={List}
        options={{
          tabBarLabel: 'List',
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
        name="CustomFood"
        component={CustomFood}
        options={{
          tabBarLabel: 'Custom Food',
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
        name="MealTime"
        component={MealTime}
        options={{
          tabBarLabel: 'Meal Time',
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
