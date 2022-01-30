import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, Keyboard} from 'react-native';
import {COLORS, WIDTH, GAP, FONT, HEIGHT} from '../../Utils/constants';

const LoginInput = (props) => {
  const {type, placeholder, value, onChange, onBlur, keyboard, max} = props;
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#dad0d2"
        placeholder={placeholder}
        secureTextEntry={type === 'password' ? true : false}
        onChangeText={(text) => onChange(text)}
        value={value}
        onBlur={onBlur}
        keyboardType={keyboard ? keyboard : 'default'}
        maxLength={max}
      />
    </View>
    // source={type === "email" ? require('../../Assets/Auths/message_icon.png') : require('../../Assets/Auths/locked.png')}
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY,
    //margin: GAP.SMALL - 1,
    // height: HEIGHT * 0.0658,
    marginVertical: GAP.SMALL,
    alignItems: 'center',
  },
  textInput: {
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.BLACK,
    // backgroundColor: 'red',
    // padding: HEIGHT * 0.0105,
    flex:1,
    width: '90%',
    paddingTop:10,
    paddingBottom:10,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: 14,
    
  },
});

export default LoginInput;
