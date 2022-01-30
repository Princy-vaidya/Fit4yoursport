import React, {useState} from 'react';
import {View, Text, ImageBackground, StyleSheet, Alert,SafeAreaView,ScrollView} from 'react-native';
import Loader from '../../Components/Common/Loader';
import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import {Formik} from 'formik';
import LoginInput from '../../Components/Inputs/loginInput';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import * as Yup from 'yup';
import Button from '../../Components/Common/Button';
import {globalStyle} from '../../Utils/styles';
import Header from '../../Utils/Header'

export default function ForgotPassword(props) {
  const {navigate} = props.navigation;

  const [loading, setLoading] = useState(false);
  const [showSuccess, SetshowSuccess] = useState(false);

  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const resetPassword = (values) => {
    console.log(!validate(email));
    let email = values.email.toLowerCase();
    let fromSignUp = false;
    if (email == '') {
      Toast.show('Please Enter Email Address');
    } else if (!validate(email)) {
      Toast.show('Please Enter Email Address');
    } else {
      setLoading(true);
      const data = {
        email,
      };
      Network('/generate-fp-otp', 'post', data)
        .then((res) => {
          setLoading(false);
          console.log(JSON.stringify(res.response_message));
          if (res.response_code === 2000) {
            Toast.show(res.response_message);

            SetshowSuccess(true);
            Toast.show(res.response_message);
            navigate('Verification', {
              email: email,
              fromSignUp: 3,
            });
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
  const NewPass = () => {
    props.navigation.navigate('NewPass');
  };

  return (
    <SafeAreaView style={styles.container}>
       <Header 
        type='back'
        navigation={props.navigation}
        title='Forgot Password'
        />
      {/* <View style={styles.contain}> */}
       
        <Loader loading={loading} />
        <ScrollView
       showsVerticalScrollIndicator={false}
       >
        {/* <Text style={[globalStyle.SemiboldMedium, styles.siginText]}>
          Forgot Password{' '}
        </Text> */}
        <Text style={styles.subText}>
          A password reset link will be sent to your email.
        </Text>
        <Formik initialValues={{email: ''}} validationSchema={Validate}>
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
                  placeholder="Enter Registered Email ID"
                  value={values.email}
                  onChange={handleChange('email')}
                  type="email"
                  max={50}
                  // icon={require('./../../Assets/Auths/message_icon.png')}
                  onBlur={() => setFieldTouched('email')}
                />
                {touched.email && errors.email && (
                  <Text style={styles.formError}>{errors.email}</Text>
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
      {/* </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // alignItems: 'center',
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
