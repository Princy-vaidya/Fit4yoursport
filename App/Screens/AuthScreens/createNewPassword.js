import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet,SafeAreaView,ScrollView} from 'react-native';
import Loader from '../../Components/Common/Loader';
import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import {Formik} from 'formik';
import LoginInput from '../../Components/Inputs/loginInput';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import * as Yup from 'yup';
import Header from '../../Utils/Header'

import Button from '../../Components/Common/Button';
import {globalStyle} from '../../Utils/styles';

export default function createNewPassword(props) {
  const {navigation, route} = props;
  const {navigate} = props.navigation;

  const otpId = route.params.otpId;
  const [loading, setLoading] = useState(false);
  const [showSuccess, SetshowSuccess] = useState(false);

  useEffect(() => {
    console.log(JSON.stringify(otpId));
  });

  const resetPassword = (values) => {
    let password = values.password;

    if (password == '') {
      Toast.show('Please Enter Password');
    } else if (values.cpassword == '') {
      Toast.show('Please Enter Confirm Password');
    } else if (values.password !== values.cpassword) {
      alert("Passwords don't match");
    } else {
      setLoading(true);
      const data = {
        id: otpId,
        password: values.password,
      };
      Network('/reset-password', 'post', data)
        .then((res) => {
          setLoading(false);
          if (res.response_code === 2000) {
            SetshowSuccess(true);
            Toast.show(res.response_message);
            navigate('Login');
          } else {
            Toast.show(res.response_message);
          }
        })
        .catch((error) => {
          Toast.show(error);
          setLoading(false);
        });
    }
  };

  const Validate = Yup.object().shape({
    email: Yup.string()
      .email('Not a valid email !')
      .required('Email is required !'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        type='back'
        navigation={props.navigation}
        title='Forgot Password'
        />
      {/* <View style={styles.contain}> */}
        <Loader loading={loading} />
        {/* <Text style={[globalStyle.SemiboldMedium, styles.siginText]}>
          Forgot Password{' '}
        
        </Text> */}
        <ScrollView>
        <Text style={styles.subText}>
          A password reset link will be sent to your email.
        </Text>
        <Formik
          initialValues={{password: '', cpassword: ''}}
          onSubmit={(values) => resetPassword(values)}
          validationSchema={Validate}>
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
              <View style={styles.mContain}>
                <LoginInput
                  placeholder="New Password"
                  value={values.password}
                  type="password"
                  max={25}
                  onChange={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.formError}>{errors.password}</Text>
                )}

                <LoginInput
                  placeholder="Confirm New Password"
                  value={values.cpassword}
                  onChange={handleChange('cpassword')}
                  type="password"
                  max={25}
                  // icon={require('./../../Assets/Auths/message_icon.png')}
                  onBlur={() => setFieldTouched('cpassword')}
                />
                {touched.cpassword && errors.cpassword && (
                  <Text style={styles.formError}>{errors.cpassword}</Text>
                )}
              </View>
              <Button
                onPress={() => resetPassword(values)}
                type="white"
                title="Submit"
              />
            </>
          )}
        </Formik>
        {showSuccess && (
          <Text style={styles.successMsg}>
            Password reset email has been sent. Please check your email.
          </Text>
        )}
        </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  contain: {
    width: WIDTH * 0.9,
    alignItems: 'center',
    marginTop: 10,
  },
  mContain: {
    width: '100%',
    alignItems: 'center',
    borderColor: COLORS.GRAY,
    borderWidth: 0.5,
    padding: 10,
  },
  siginText: {
    color: COLORS.WHITE,
    marginVertical: GAP.LARGE,
  },
  subText: {
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.SMALL,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginTop: -GAP.MEDIUM,
    marginBottom: GAP.MEDIUM,
  },
  formError: {
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.REGULAR,
    textAlign: 'center',
    fontSize: FONT.SIZE.SMALL,
  },
  successMsg: {
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginTop: GAP.MEDIUM + 10,
  },
});
