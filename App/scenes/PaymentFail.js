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

export default class PaymentFail extends PureComponent {
  

  

  render() {

    return (
      <SafeAreaView style={styles.container}>
        {/* <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
         <Text style={styles.header}>Back</Text> 
         </TouchableWithoutFeedback> */}

        {/* <Header
          type='back'
          title='Payment Process'
          navigation={this.props.navigation} /> */}
        <View style={styles.maincontainer}>

          <Image source={require('../Assets/Auths/failed.png')}
          style={{width:200,height:200}}/>
          <Text style={styles.header}>Failed!</Text>


          <Text style={styles.instruction}>Unfortunately we have not receive your payment,
       try again later.</Text>

          <Button
            text="Try again"
            onPress={()=>this.props.navigation.navigate('Subscription')}
          />
          
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
