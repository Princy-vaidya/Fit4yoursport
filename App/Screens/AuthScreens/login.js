import React, {useState, useEffect,useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {globalStyle} from '../../Utils/styles';

import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import LoginInput from '../../Components/Inputs/loginInput';
import Button from '../../Components/Common/Button';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import Loader from '../../Components/Common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
// import {loginUser} from '../../Redux/Actions/authAction';
import {useDispatch} from 'react-redux';
import {Formik, replace} from 'formik';
import * as Yup from 'yup';
import {
  setSessionKey,
  setToken,
  setUserId,
  setUserName,
  setUserType,
  getSessionKey,
  setUserEmail,
  getDeviceToken
} from '../../Utils/Preference';
// import AuthContext from '../../Utils/context';
import { saveToken } from '../../redux/actions/saveTokenAction'
import {connect} from 'react-redux';
import {AuthContext} from '../../contexts/AuthContext'


 function Login(props) {
  const {navigate,replace} = props.navigation;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {login} = useContext(AuthContext);
  const {type, placeholder, value, onChange, onBlur, keyboard, max} = props;

  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const submitAction = async (values) => {
    let email = values.email.toLowerCase();
    console.log('lllll')
    if (email == '') {
      Toast.show('Please Enter Email Address');
    } else if (validate(email) == false) {
      Toast.show('Please Enter Valid Email Address');
    } else if (values.password === '' || values.password.length < 4) {
      Toast.show('Please Enter Password');
    } else {
      setLoading(true);
      const data = {
        email:email,
        password: values.password,
        devicetoken: await getDeviceToken(),
        apptype: Platform.OS.toUpperCase(),
      };
      console.log('login',data)
      Network('/login', 'post', data)
        // .then(async (res) => {
        .then(async (res) => {
          // setLoading(false);
          console.log('res',res);

          if (res.response_code === 2000) {
            setToken(res.response_data.authtoken);
            setUserId(res.response_data._id);
            setSessionKey('true');
            setLoading(false);
            setUserType(res.response_data.user_type);
            setUserEmail(res.response_data.email);
            setUserName(res.response_data.fname)
            try {
              setLoading(true);
              await login(email,values.password);
              // console.log('lkk',login(email,values.password))
            } catch (e) {
              // setError(e.message);
              setLoading(false);
              console.log(err)
            } 
            Toast.show(res.response_message);
           
          } else if (res.response_code === 5010) {
            setLoading(false);
            Toast.show(res.response_message);
            navigate('Verification', {
              email: email,
              fromSignUp: 1,
            });
          } else {
            setLoading(false);
             Toast.show(res.response_message);
          }
        })

        .catch((error) => {
          setLoading(false);
         Toast.show(res.response_message);
        });
    }
  };

  const signupTextpress = () => {
    props.navigation.navigate('Signup');
  };

  const forgotPass = () => {
    props.navigation.navigate('ForgotPass');
  };

  const Validate = Yup.object().shape({
    email: Yup.string()
      .email('Not a valid email !')
      .required('Email is required !'),
    password: Yup.string().required('Password is required !'),
  });

  return (
    <ImageBackground style={styles.container}>
      <Loader loading={loading} />
      <Animatable.View style={styles.subContainer}>
        <ScrollView 
        showsVerticalScrollIndicator={false}
        >
        <Logo />

        <Text
          style={[globalStyle.SemiboldMedium, styles.siginText]}
          animation="slideInDown">
          Sign In
        </Text>
        <Text style={styles.text}>Hi there! Nice to see you</Text>

        <Formik
          initialValues={{email: '', password: ''}}
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.iconContainer}>
                  <Image
                    resizeMode="contain"
                    source={require('../../Assets/Auths/message_icon.png')}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.textContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor="#dad0d2"
                    placeholder="Email address"
                    secureTextEntry={type === 'password' ? true : false}
                    onChangeText={handleChange('email')}
                    value={values.email}
                    onBlur={() => setFieldTouched('email')}
                    keyboardType={keyboard ? keyboard : 'default'}
                    maxLength={50}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.formError}>{errors.email}</Text>
                  )}
                </View>

              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.iconContainer}>
                  <Image
                    resizeMode="contain"
                    source={require('../../Assets/Auths/locked.png')}
                    style={[styles.icon,{height: HEIGHT * 0.032}]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor="#dad0d2"
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    value={values.password}
                    secureTextEntry={true}
                    maxLength={25}
                    onBlur={() => setFieldTouched('password')}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.formError}>{errors.password}</Text>
                  )}
                </View>
               
              </View>

              <Button
                onPress={() => submitAction(values)}
                type="white"
                title="Sign in"
              />
            </>
          )}
        </Formik>
        <ForgotPass onPress={forgotPass} />
        {/* <FacebookLogin /> */}
        {/* <AppleLogin /> */}
        <NewSignupText onPress={signupTextpress} />
        </ScrollView>
      </Animatable.View>
    </ImageBackground>
  );
}

const Logo = () => {
  return (
    <Image
      resizeMode="contain"
      source={require('../../Assets/logo.png')}
      style={styles.logo}
    />
  );
};

const ForgotPass = (props) => {
  return (
    <View style={styles.forgotPassContainer}>
      <Text onPress={props.onPress} style={styles.forgotPass}>
        Forgot password ?
      </Text>
    </View>
  );
};

const NewSignupText = (props) => {
  return (
    <View style={styles.newUser}>
      <Text onPress={props.onPress} style={styles.newUserText}>
        Don't have an account ? <Text style={styles.signUp}>Signup</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width:'100%',
    backgroundColor: COLORS.WHITE,
  },
  subContainer: {
    
    alignSelf: 'center',
    width: '85%',
  },
  logo: {
    width: WIDTH * 0.44,
    height: HEIGHT * 0.18,
    alignSelf:'center'
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
  forgotPass: {
    color: COLORS.GRAY,
    fontFamily: FONT.FAMILY.REGULAR,
    textAlign: 'right',
    padding: 5,
  },
  forgotPassContainer: {
    marginVertical: HEIGHT * 0.01,
    alignSelf: 'flex-end',  
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
  newUser: {
    marginTop: HEIGHT * 0.09,
  },
  newUserText: {
    textAlign: 'center',
    color: COLORS.GRAY,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.LARGE,
  },
  signUp: {
    color: COLORS.RED,
    fontFamily: FONT.FAMILY.BOLD,
  },
  formError: {
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.REGULAR,
    textAlign: 'center',
    fontSize: FONT.SIZE.SMALL,
  },
  iconContainer: {
    // position: 'absolute',
    // padding: HEIGHT * 0.023,
    backgroundColor: COLORS.WHITE,
    borderRadius: 100,
    left: 0,
    zIndex:1
  },
  icon: {
     position:"absolute",
    width: WIDTH * 0.10,
    height: HEIGHT * 0.026,
    tintColor: COLORS.GRAY,
    left:10,
    top:-10,
    zIndex:999
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
    alignItems: 'center',
  },
  textInput: {
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.BLACK,
    // backgroundColor: 'red',
    //  marginVertical:8 ,
    flex:1,
    ...Platform.select({
      android: {
        paddingTop:8,
      },
      ios: {
        paddingTop:0
      }
    }),
    width: "65%",
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: 14,
  }
});
const mapDispatchToProps = (dispatch) => {
  return {
    reduxSaveUserDetail: (userDetails) =>
      dispatch(saveToken(userDetails))
  }
}

export default connect(null, mapDispatchToProps)(Login);
