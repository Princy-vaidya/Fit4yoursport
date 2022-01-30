import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { HEIGHT, COLORS, WIDTH, FONT, GAP } from '../../Utils/constants';
import * as Animatable from 'react-native-animatable';

export default function GenderSelector(props) {
  const {value, onChange} = props
  console.log("Value", value);
  
  useEffect(() => {
    console.log("Value", value);
    
  }, [value])

  const changeSelector = (gender) => { 
    onChange(gender)
  }

  return (
    <Animatable.View animation="fadeInDown" style={styles.container}>
      <Text style={styles.lable}>Select Gender</Text>
      <View style={styles.selectContainer}>
        <TouchableOpacity animation="fadeInDown" onPress={() => changeSelector('male')} style={[value == "male" ? styles.activeContainer : styles.inactiveContainer]}>
          <Image resizeMode="contain" source={require('../../Assets/Auths/Male.png')} style={styles.genderIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeSelector('female')} style={[value == "female" ? styles.activeContainer : styles.inactiveContainer]}>
          <Image resizeMode="contain" source={require('../../Assets/Auths/Female.png')} style={styles.genderIcon} />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: HEIGHT * 0.02,
    alignItems: 'center'
  },
  lable: {
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    textAlign: 'center',
    marginVertical: HEIGHT * 0.02
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  activeContainer: {
    padding: HEIGHT * 0.02,
    borderRadius: 100,
    backgroundColor: COLORS.WHITE,
    borderWidth: 0.6,
    borderColor: COLORS.GRAY,
    marginHorizontal: GAP.SMALL
  },
  inactiveContainer: {
    padding: HEIGHT * 0.02,
    borderRadius: 100,
    backgroundColor: '#b7014863',
    borderWidth: 0.6,
    borderColor: COLORS.GRAY,
    marginHorizontal: GAP.SMALL
  },
  genderIcon: {
    height: HEIGHT * 0.023,
    width: WIDTH * 0.05
  }
})