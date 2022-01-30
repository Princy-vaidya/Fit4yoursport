import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {globalStyle} from '../../Utils/styles';
import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import {name, dial_code, code} from '../../Utils/country.json';

import LoginInput from '../../Components/Inputs/loginInput';
import Button from '../../Components/Common/Button';
import {Validate} from '../../Components/Inputs/signupValidate';
import {Formik} from 'formik';
import Network from '../../Services/Network';
import Loader from '../../Components/Common/Loader';
import Toast from 'react-native-simple-toast';
import HTML from 'react-native-render-html';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



export default function Signup(props) {
  const {navigate} = props.navigation;
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [countryDialogVisible, setCountryDialogVisible] = useState(false);
  const [isprivacyPolicy, setIsprivacyPolicy] = useState(false);
  const {type, placeholder, value, onChange, onBlur, keyboard, max} = props;
  const customData = require('../../Utils/country.json');
  const [showModal, setShowModal] = useState(false);
  const [termPolicy, setTermPolicy] = useState([]);
  const [showPrivacyLink, setShowPrivacyLink] = useState(false);


  // const registerSubmit = (values) => {
  //   setLoading(true);
  //   let email = values.email.toLowerCase();
  //   const data = {
  //     email,
  //     fullname: values.fname,
  //     lastname: values.lname,
  //     password: values.password,
  //     phone_no: values.phone_no,
  //     // email: 'jayantakarmakar03@gmail.com',
  //     // password: '123456',
  //     // apptype: 'ANDROID',
  //     // fname: 'jayanta',
  //     // lname: 'karmakar',
  //     // phone_no: '2342323234',
  //     // email_verify: 'yes',
  //   };
  //   //  setTimeout(() => {
  //   //   setLoading(false)
  //   //   navigate('Verification', {email: values.email})
  //   //  }, 3000)

  //   Network('/register', 'post', data)
  //     .then((res) => {
  //       if (res.STATUSCODE === 200) {
  //         setLoading(false);
  //         Toast.show(res.message);
  //         navigate('Verification', {email});
  //       } else {
  //         Toast.show(res.message);
  //         setLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       Toast.show(error);
  //     });
  // };


  useEffect(function () {
    getTermsPrivacy()
  }, []);


  const getTermsPrivacy = async() => {
    
     Network('/list-term-condition', 'get', '',)
      .then(async function (data) {
       
       if(data.response_code===2000){
        // alert(data.response_data)
         await setTermPolicy(data.response_data);
         setTerm(data.response_data[0].title)
         
       }
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const submitAction = (values) => {
    let email = values.email.toLowerCase();

    console.log(values.cpassword);

    if (values.fname == '') {
      Toast.show('Please Enter First Name');
    } else if (values.lname == '') {
      Toast.show('Please Enter Last Name');
    } else if (email == '') {
      Toast.show('Please Enter Email Address');
    } else if (!validate(email)) {
      Toast.show('Please Enter Email Address');
    } else if (values.phone_no == '') {
      Toast.show('Please Enter Mobile Number');
    } 
    // else if (values.phone_no.length < 10) {
    //   Toast.show('Please Enter Valid Mobile Number');
    // } 
    else if (typeof values.password === 'undefined') {
      Toast.show('Please Enter Password');
    } else if (typeof values.cpassword === 'undefined') {
      Toast.show('Please Enter Confirm Password');
    } else if (values.password !== values.cpassword) {
      Toast.show("Passwords don't match");
    } else if (!isprivacyPolicy) {
      Toast.show('Please agree terms and conditions');
    } else {
      setLoading(true);

      const data = {
        email,
        fname: values.fname,
        lname: values.lname,
        password: values.password,
        phone_no: values.phone_no,
        country_code: countryCode,
        // email_verify: 'yes',
        apptype: 'ANDROID',
      };
      Network('/register', 'post', data)
        .then((res) => {
          // console.log(JSON.stringify(res.response_code));
          if (res.response_code == 2000) {
            setLoading(false);
            Toast.show(res.response_message);
            navigate('Verification', {
              email: email,
              fromSignUp: 2,
            });
          } else {
            Toast.show(res.response_message);
            setLoading(false);
            console.log(JSON.stringify(res.response_message));
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show(error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
       showsVerticalScrollIndicator={false}
       >
        <Loader loading={loading} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
          <Animatable.View animation="fadeInDown" style={styles.subContainer}>
            <Logo />
            <Text
              style={[globalStyle.SemiboldMedium, styles.siginText]}
              animation="slideInDown">
              Sign Up
            </Text>
            <Text style={styles.text}>Please sign up to enter in a app</Text>

            <Formik
              initialValues={{
                email: '',
                fname: '',
                lname: '',
                phone_no: '',
              }}
              onSubmit={(values) => registerSubmit(values)}
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
                  <LoginInput
                    placeholder="First Name"
                    value={values.fname}
                    onChange={handleChange('fname')}
                    max={25}
                    onBlur={() => setFieldTouched('fname')}
                  />
                  {touched.fname && errors.fname && (
                    <Text style={styles.formError}>{errors.fname}</Text>
                  )}
                  <LoginInput
                    placeholder="Last Name"
                    value={values.lname}
                    onChange={handleChange('lname')}
                    max={25}
                    onBlur={() => setFieldTouched('lname')}
                  />
                  {touched.lname && errors.lname && (
                    <Text style={styles.formError}>{errors.lname}</Text>
                  )}
                  <LoginInput
                    placeholder="Enter your E-mail"
                    value={values.email}
                    onChange={handleChange('email')}
                    type="email"
                    onBlur={() => setFieldTouched('email')}
                    max={50}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.formError}>{errors.email}</Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View style={styles.textContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#dad0d2"
                        placeholder="Phone Number"
                        secureTextEntry={type === 'password' ? true : false}
                        onChangeText={handleChange('phone_no')}
                        value={values.phone_no}
                        onBlur={() => setFieldTouched('phone_no')}
                        keyboardType={'numeric'}
                        maxLength={50}
                      />
                      {touched.phone_no && errors.phone_no && (
                        <Text style={styles.formError}>{errors.phone_no}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={() => setCountryDialogVisible(true)}>
                      <Text>{countryCode}</Text>

                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/ic_dropdown.png')}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>

                  <LoginInput
                    placeholder="Password"
                    value={values.password}
                    type="password"
                    onChange={handleChange('password')}
                    max={25}
                    onBlur={() => setFieldTouched('password')}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.formError}>{errors.password}</Text>
                  )}
                  <LoginInput
                    placeholder="Confirm Password"
                    value={values.cpassword}
                    type="password"
                    onChange={handleChange('cpassword')}
                    max={25}
                    onBlur={() => setFieldTouched('cpassword')}
                  />
                  {touched.cpassword && errors.cpassword && (
                    <Text style={styles.formError}>{errors.cpassword}</Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf:'center',
                     justifyContent:'space-between',
                    
                    }}>
                    <TouchableOpacity
                      style={{padding: 4}}
                      onPress={() => setIsprivacyPolicy(!isprivacyPolicy)}>
                      <Image
                        style={
                          !isprivacyPolicy
                            ? {
                                height: 15,
                                width: 15,
                                borderWidth: 0.2,
                                borderColor: COLORS.BLACK,
                                borderRadius: 3,
                                backgroundColor: 'white',
                                marginRight: 10,
                              }
                            : {
                                height: 15,
                                width: 15,
                                borderWidth: 0.2,
                                borderColor: COLORS.BLACK,
                                backgroundColor: 'red',
                                borderRadius: 3,
                                marginRight: 10,
                              }
                        }
                      />
                    </TouchableOpacity>
                  
                
                    <Text onPress={props.onPress} style={styles.agreeText}>
                      I agree to the</Text>
                      </View>
                      <View style={{flexDirection:'row',alignItems:'center', marginBottom:10,}}>
                   <TouchableOpacity onPress={()=>setShowModal(true)}>
                      <Text style={styles.signIn}> Terms of services </Text>
                      </TouchableOpacity>
                     
                    
                      <TouchableOpacity>
                      <Text style={styles.agreeText}>and  </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>setShowPrivacyLink(true)}>
                      <Text style={styles.signIn}>Privacy Policy</Text>
                      </TouchableOpacity>
                      </View>
                     
                     
                  

                  <Button
                    onPress={() => submitAction(values)}
                    type="white"
                    title="Continue"
                  />
                </>
              )}
            </Formik>

            {/* <Button type="white" title="Register" onPress={registerSubmit} /> */}
            <NewSignupText onPress={() => props.navigation.navigate('Login')} />
          </Animatable.View>
        </KeyboardAwareScrollView>
      </ScrollView>

      <Modal
        visible={countryDialogVisible}
        transparent={true}
        animationType={'fade'}
        onRequestClose={() => {
          countryDialogVisible;
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.6)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '80%',
              alignItems: 'center',
              borderRadius: 6,
              elevation: 4,
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                textAlign: 'center',
                paddingVertical: 10,
                marginTop: 10,
              }}>
              CountryList
            </Text>

            <View
              style={{
                width: '100%',
                height: 400,
              }}>
              {/* <View
                style={{
                  borderColor: 'red',
                  borderWidth: 1,
                  borderRadius: 30,
                  marginHorizontal: 20,
                  marginVertical: 10,
                  backgroundColor: '#fff',
                  elevation: 5,
                  height: 40,
                }}>
                <TextInput
                  placeholder="Search Country"
                  style={{marginStart: 10}}
                />
              </View> */}

              <FlatList
                style={{flex: 1}}
                data={customData}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCountryCode(item.dial_code);
                      setCountryDialogVisible(false);
                    }}>
                    <View
                      style={{
                        flex: 0.8,
                        flexDirection: 'row',
                        padding: 8,
                      }}>
                      <Text style={{flex: 0.2, marginLeft: 10}}>
                        {item.dial_code}
                      </Text>
                      <Text style={{flex: 0.6}}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.PRIMARY,
                borderBottomStartRadius: 6,
                borderBottomEndRadius: 6,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  padding: 10,

                  textAlign: 'center',
                  flex: 1,
                }}
                onPress={() => {
                  setCountryDialogVisible(false);
                }}>
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true}
        visible={showModal}
        onBackdropPress={() => setShowModal(false)}
        >
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.6)',
          }}>
            <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              alignItems: 'center',
              borderRadius: 6,
              elevation: 4,
              flexDirection: 'column',
            }}>
              <View style={{backgroundColor:COLORS.PRIMARY,width:'100%',alignItems:'center'}}>
              <Text style={{
                fontSize:FONT.SIZE.MEDIUM,
                fontFamily:FONT.FAMILY.SEMI_BOLD,
                color:COLORS.WHITE,
                margin:10}}>
                {termPolicy.length===0 ?'': termPolicy[0].title }
              </Text>
              </View>
              <ScrollView style={{margin:10,height:HEIGHT*0.6}}>
               <HTML
                        html={termPolicy.length!==0 ?termPolicy[0].description:''}
                        imagesMaxWidth={200}
                        
                    />
            </ScrollView>
                   <TouchableOpacity 
                   style={{backgroundColor:COLORS.PRIMARY,width:'100%',alignItems:'center'}}
                   onPress={()=>setShowModal(false)}>
                     <Text style={{
                fontSize:FONT.SIZE.MEDIUM,
                fontFamily:FONT.FAMILY.SEMI_BOLD,
                color:COLORS.WHITE,
                margin:10}} >OK</Text>
                     </TouchableOpacity> 
            </View>
        </View>
        </Modal>

        <Modal transparent={true}
        visible={showPrivacyLink}
        onBackdropPress={() => setShowPrivacyLink(false)}
        >
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.6)',
          }}>
            <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              alignItems: 'center',
              borderRadius: 6,
              elevation: 4,
              flexDirection: 'column',
            }}>
              <View style={{backgroundColor:COLORS.PRIMARY,width:'100%',alignItems:'center'}}>
              <Text style={{
                fontSize:FONT.SIZE.MEDIUM,
                fontFamily:FONT.FAMILY.SEMI_BOLD,
                color:COLORS.WHITE,
                margin:10}}>
                {termPolicy.length===0 ?'': termPolicy[1].title }
              </Text>
              </View>
              <ScrollView style={{margin:10,height:HEIGHT*0.6}}>
               <HTML
                        html={termPolicy.length!==0 ?termPolicy[1].description:''}
                        imagesMaxWidth={200}
                        
                    />
            </ScrollView>
                   <TouchableOpacity 
                   style={{backgroundColor:COLORS.PRIMARY,width:'100%',alignItems:'center'}}
                   onPress={()=>setShowPrivacyLink(false)}>
                     <Text style={{
                fontSize:FONT.SIZE.MEDIUM,
                fontFamily:FONT.FAMILY.SEMI_BOLD,
                color:COLORS.WHITE,
                margin:10}} >OK</Text>
                     </TouchableOpacity> 
            </View>
        </View>
        </Modal>
    </SafeAreaView>
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

const ForgotPass = () => {
  return (
    <View style={styles.forgotPassContainer}>
      <Text style={styles.forgotPass}>Forgot password ?</Text>
    </View>
  );
};

const NewSignupText = (props) => {
  return (
    <View style={styles.newUser}>
      <Text onPress={props.onPress} style={styles.newUserText}>
        have an account ? <Text style={styles.signIn}> Sign In</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height:'100%',
    width: '100%',
    backgroundColor: COLORS.WHITE,
  },
  subContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
    marginVertical: '10%',
  },
  logo: {
    width: WIDTH * 0.44,
    height: HEIGHT * 0.18,
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
    color: COLORS.WHITE,
    fontFamily: FONT.FAMILY.REGULAR,
    textAlign: 'right',
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
    marginTop: HEIGHT * 0.01,
  },
  signIn: {
    color: COLORS.BLACK,
    fontFamily: FONT.FAMILY.BOLD,
  },
  newUserText: {
    color: COLORS.GRAY,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.LARGE,
  },
  agreeText: {
    color: COLORS.GRAY,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.SMALL,
    // marginVertical: GAP.SMALL,
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
   
    alignItems: 'center',
  },
  textInput: {
    fontSize: FONT.SIZE.MEDIUM,
    color: COLORS.BLACK,
    // backgroundColor: 'red',
    // padding: HEIGHT * 0.0105,
    width: WIDTH * 0.4,
    flex:1,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: 14,

  },
  iconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    left: 0,
    marginStart: 10,
  },
  icon: {
    width: WIDTH * 0.05,
    height: HEIGHT * 0.016,
    tintColor: COLORS.BLACK,
    alignSelf: 'center',
    marginLeft: 4,
  },
  modalView: {
    backgroundColor: 'white',
    width: '70%',
    alignSelf: 'center',
    borderRadius: 15,
    borderTopRightRadius: 15
  },
});
