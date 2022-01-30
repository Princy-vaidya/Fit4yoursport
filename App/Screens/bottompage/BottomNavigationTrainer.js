import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH} from '../../Utils/constants';

const BottomNavigationTrainer = (props) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        elevation: 4,
        backgroundColor: '#f2f2f2',
      }}>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.updateSelectedValue(1)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/Auths/home.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: props.selectedValue == 1 ? 'red' : COLORS.GRAY,
              resizeMode: 'contain',
              marginBottom: 5,
            }}
          />
          <Text
            style={
              props.selectedValue == 1 ? {color: 'red'} : {color: COLORS.GRAY}
            }>
            Home
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.updateSelectedValue(2)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/Auths/Studentlist.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: props.selectedValue == 2 ? 'red' : COLORS.GRAY,
              resizeMode: 'contain',
              marginBottom: 5,
            }}
          />
          <Text
            style={
              props.selectedValue == 2 ? {color: 'red'} : {color: COLORS.GRAY}
            }>
            Student List
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.updateSelectedValue(3)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/Auths/video.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: props.selectedValue == 3 ? 'red' : COLORS.GRAY,
              resizeMode: 'contain',
              marginBottom: 5,
            }}
          />
          <Text
            style={
              props.selectedValue == 3 ? {color: 'red'} : {color: COLORS.GRAY}
            }>
            Video
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => props.updateSelectedValue(4)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../Assets/Auths/bottomcalendar.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: props.selectedValue == 4 ? 'red' : COLORS.GRAY,
              resizeMode: 'contain',
              marginBottom: 5,
            }}
          />
          <Text
            style={
              props.selectedValue == 4 ? {color: 'red'} : {color: COLORS.GRAY}
            }>
            Calender
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavigationTrainer;
