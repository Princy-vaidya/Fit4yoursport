import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Button from '../Common/Button';
import { WIDTH, GAP, HEIGHT, COLORS } from '../../Utils/constants';

export default function ActionButtons({passCard, likeCard, message}) {
  return (
    <View>
      <View style={styles.actionButtons}>
        <View>
          <TouchableOpacity onPress={passCard} style={styles.buttonStyle}>
            <Image resizeMode="contain" source={require('../../Assets/Home/Cross.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity onPress={message} style={[styles.buttonStyle, {backgroundColor: COLORS.PRIMARY}]}>
            <Image resizeMode="contain" source={require('../../Assets/Home/messageWhite.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity onPress={likeCard} style={styles.buttonStyle}>
            <Image resizeMode="contain" source={require('../../Assets/Home/Love.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: '5%'
  },
  buttonStyle: {
    width: WIDTH * 0.25,
   // padding: GAP.SMALL,
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  icon: {
    width: WIDTH * 0.04,
    height: HEIGHT * 0.05
  }
})
