import React, {useState} from 'react';
import {View, Text, Dimensions, FlatList, Image} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import {ScrollView} from 'react-native-gesture-handler';

// import TabNavigation from '../../Utils/TabNavigation';
import stripe from 'tipsi-stripe';
import  CardFormScreen from '../../scenes/CardFormScreen'

stripe.setOptions({
  publishableKey:"pk_live_51JHOONL50adRyLAuleuOmKaDSjOqvHSYNXIRb31J4Yc99dxdHlN2TXOA6u9b0DZLHGE5IzqIY0aJ4NW91crx52pP00X52IzgIa",
})

export default function MyPlan({navigation}) {

  const [pay,setPay]=useState(false)

  return (
    <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <View style={{flex: 0.1}}>
        <Header navigation={navigation} title="My Plan" isHomePage={false} />
      </View>
      <View style={{backgroundColor: '#949494', width: '100%', height: 0.5}} />
      <View
        style={{
          width: '85%',
          height: 140,
          borderRadius: 10,
          elevation: 2,
          marginHorizontal: 30,
          marginVertical: 10,
          marginTop: 40,
          padding: 20,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: COLORS.BLACK,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          Current Plan
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text
              style={{
                color: COLORS.GRAY,
                marginTop: 10,
              }}>
              Monthly
            </Text>
            <Text
              style={{
                color: COLORS.BLACK,
                marginTop: 8,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.GRAY,
                  fontSize: 20,
                }}>
                $36,56
              </Text>
              /month
            </Text>
            <Text
              style={{
                color: COLORS.GRAY,
                marginTop: 8,
              }}>
              <Image
                source={require('../../Assets/Auths/calendar.png')}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
              {''} Till 05-Nov-2020
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              backgroundColor: COLORS.RED,
              borderRadius: 20,
              marginVertical: GAP.SMALL + 10,
              borderColor: COLORS.RED,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: FONT.SIZE.SMALL,
                color: COLORS.WHITE,
                fontFamily: FONT.FAMILY.REGULAR,
                fontWeight: 'bold',
              }}>
              Renew
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
