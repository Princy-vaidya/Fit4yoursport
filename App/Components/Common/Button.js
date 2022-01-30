import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HEIGHT, GAP, COLORS, FONT} from '../../Utils/constants';


export default function Button(props) {
  const {disabled} = props;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={props.onPress}
      style={props.title==='ADD TIP'?styles.buttonRedAdd:[
        props.type === 'white' ? styles.buttonRed : styles.buttonDark,
        props.width ? {width: props.width} : {},
      ]}>
      <Text
        style={
          props.type === 'white' ? styles.redButtonText : styles.darkButtonText
        }>
        {props.title ? props.title : 'button'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWhite: {
    width: '100%',
    padding: HEIGHT * 0.02,
    backgroundColor: COLORS.WHITE,
    borderRadius: 100,
    marginVertical: GAP.SMALL + 5,
  },
  buttonRed: {
    width: '50%',
    padding: HEIGHT * 0.02,
    backgroundColor: COLORS.RED,
    borderRadius: 25,
    marginVertical: GAP.SMALL + 5,
    alignSelf:'center'
  },
  buttonRedAdd: {
    width: '30%',
    padding: HEIGHT * 0.015,
    backgroundColor: COLORS.RED,
    borderRadius: 25,
    marginVertical: GAP.SMALL + 5,
    alignSelf:'center'},

  whiteButtonText: {
    textAlign: 'center',
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.WHITE,
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.REGULAR,
  },
  redButtonText: {
    textAlign: 'center',
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.WHITE,
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.REGULAR,
  },
  buttonDark: {
    width: '100%',
    padding: HEIGHT * 0.02,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 100,
    marginVertical: GAP.SMALL + 5,
  },
  darkButtonText: {
    textAlign: 'center',
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.WHITE,
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.SEMI_BOLD,
  },
});
