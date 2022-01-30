import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, SafeAreaView,Image } from 'react-native';
import stripe from 'tipsi-stripe';
import Button from '../tripsi/Button';
import testID from '../Utils/testID';
import { demoCardFormParameters } from './demodata/demodata';
import axios from 'axios';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Header from '../Utils/Header';
import {COLORS,FONT} from '../Utils/constants'

export default class PaymentSuccess extends PureComponent {
  

  

  render() {

    return (
      <SafeAreaView style={styles.container}>
       
        <View style={styles.maincontainer}>

          <Image source={require('../Assets/Auths/success.png')}
          style={{width:200,height:200}}/>
          <Text style={styles.header}>Successful!</Text>


          <Text style={styles.instruction}>We delighted to inform that
        we received your payment.</Text>
        {this.props.route.params.packageId ?
          <Button
            text="Continue"
            onPress={()=>this.props.navigation.navigate('StandardProgram')}
          />:
          <Button
          text="Continue"
          onPress={()=>this.props.navigation.navigate('Appoinment',{trainerId:this.props.route.params.trainerId,
            subType:this.props.route.params.subType})}
        />
            }
          
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor:'white'
  },
  maincontainer: {
    // width:'90%',
    flex:1, 
    margin:10,
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
   fontSize:22,
    textAlign: 'center',
    margin: 10,
    marginTop:20,
    fontFamily:FONT.FAMILY.BOLD
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
    fontFamily:FONT.FAMILY.REGULAR
  },
  paymentMethod: {
    height: 20,
  },
})
