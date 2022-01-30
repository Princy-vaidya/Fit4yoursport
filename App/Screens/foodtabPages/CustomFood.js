import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  TextInput,
 
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Dialog from "../common/Dialog"
import { globalStyle } from '../../Utils/styles';
import { HEIGHT, WIDTH, COLORS, GAP, FONT } from '../../Utils/constants';
import LoginInput from '../../Components/Inputs/loginInput';
import Button from '../../Components/Common/Button';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import Loader from '../../Components/Common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
// import { loginUser } from '../../Redux/Actions/authAction';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getToken, getUserId, setUserId } from '../../Utils/Preference';

import * as Yup from 'yup';

export default function CustomFood(props) {
  const { navigate } = props.navigation;
  const [loading, setLoading] = useState(false);
  const { type, placeholder, value, onChange, onBlur, keyboard, max } = props;
  const [servingSize, setServingSize] = useState({
    name: 'grams',
  });
  const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
  const [exerciseList, setExerciseList] = useState([
    {
      _id: '5fb3c0bb53d0970900fa5j1g',
      name: 'grams',
    },
   
  ]);
  const [servingValue, setServingValue] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [foodName, setFoodName] = useState('');

  useEffect(function () {
    token();
  }, []);

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      setAuthToken(token);
      setUserId(id);
    } catch (e) { }
  };

  const submitAction = async (values) => {
    if (foodName == '') {
      Toast.show('Please Enter food');
    } else if (servingValue == '') {
      Toast.show('Please Enter servingvalue');
    } else {
      setLoading(true);
      const data = {
        food: values.food,
      };
      let formData = new FormData();
      formData.append('food_name', foodName);
      formData.append('user_id', userId);
      formData.append('serving_size', servingValue);
      formData.append('unit', 'Grams');
      formData.append('food_type', 'custom_food');
      formData.append('meal_type', '');
      Network('/add-food', 'post', formData, authToken)
        // .then(async (res) => {
        .then((res) => {
          setLoading(false);
          console.log(JSON.stringify(res));
          Toast.show(res.response_message);
          setFoodName('');
          setServingValue('');
        })

        .catch((error) => {
          setLoading(false);
          Toast.show(res.response_message);
        });
    }
  };
  const Validate = Yup.object().shape({
    food: Yup.string().required('food is required !'),
  });

  console.log("hello",servingSize)

  return (
    <ImageBackground style={styles.container}>
      <Loader loading={loading} />
      <Animatable.View style={styles.subContainer}>
        <Formik initialValues={{ food: '' }} validationSchema={Validate}>
          {({
            values,
            handleChange,
            errors,
            isValid,
            handleSubmit,
            setFieldTouched,
            touched,
          }) => (
              <>
                <View style={styles.textContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor="#dad0d2"
                    placeholder="Add food name"
                    secureTextEntry={type === 'password' ? true : false}
                    onChangeText={(text) => setFoodName(text)}
                    value={foodName}
                    onBlur={() => setFieldTouched('food')}
                    keyboardType={keyboard ? keyboard : 'default'}
                    maxLength={50}
                  />
                  {touched.food && errors.food && (
                    <Text style={styles.formError}>{errors.food}</Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    backgroundColor: COLORS.WHITE,
                    borderRadius: 4,
                    borderWidth: 0.5,
                    borderColor: COLORS.GRAY,
                    height: HEIGHT * 0.0658,
                    marginVertical: GAP.SMALL,
                    alignItems: 'center',
                    paddingStart: 10,
                  }}>
                  <TextInput
                    placeholder="Serving size"
                    value={servingValue}
                    keyboardType="numeric"
                    onChangeText={(text) => setServingValue(text)}
                    max={50}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.formError}>{errors.email}</Text>
                  )}
                  <View
                    style={{
                      width: '40%',
                      height: '100%',
                      flexDirection: 'row',
                      backgroundColor: '#F1F1F1',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}>

                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                      <Dialog
                        isVisible={isActivitiesDialog}
                        title="Serving Size"
                        onValueSelected={(value) => {
                          setServingSize(value);
                          setIsActivitiesDialog(false);
                        }}
                        activityList={exerciseList}
                        onCancel={()=>setIsActivitiesDialog(false)}
                      />
                    </View>
          
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        justifyContent:"flex-end"
                      }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setIsActivitiesDialog(true)}>
                        <View
                          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ color: COLORS.GRAY,paddingLeft:10 }}>{servingSize.name}</Text>
                          <AntDesign name="down" size={20} color="black" style={{color: COLORS.GRAY}}/>
                        </View>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>

                <Button
                  onPress={() => submitAction(values)}
                  type="white"
                  title="Save"
                />
              </>
            )}
        </Formik>
      </Animatable.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.WHITE,
    paddingTop: 30,
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  siginText: {
    color: COLORS.BLACK,
    alignSelf: 'flex-start',
    marginStart: 6,
    marginTop: 30,
  },
  text: {
    color: COLORS.GRAY,
    alignSelf: 'flex-start',
    marginStart: 6,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.LARGE,
    marginTop: 6,
    marginBottom: 10,
  },

  loginButton: {
    width: '100%',
    padding: HEIGHT * 0.02,
    backgroundColor: COLORS.WHITE,
    borderRadius: 100,
    marginVertical: GAP.SMALL,
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
    fontFamily: FONT.FAMILY.REGULAR,
  },
  formError: {
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.REGULAR,
    textAlign: 'center',
    fontSize: FONT.SIZE.SMALL,
  },

  textContainer: {
    width: '100%',
    // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY,
    //margin: GAP.SMALL - 1,
    height: HEIGHT * 0.0658,
    marginVertical: GAP.SMALL,
    paddingStart: 10,
  },
  textInput: {
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.BLACK,
    // backgroundColor: 'red',
    // padding: HEIGHT * 0.0105,
    // width: WIDTH * 0.6,
    flex:1,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: 14,
  },
});
