import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {COLORS, FONT, WIDTH, HEIGHT} from '../../Utils/constants';
import Button from '../../Components/Common/Button';
import Loader from '../../Components/Common/Loader';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
// import {loginUser} from '../../Redux/Actions/authAction';

export default function OtpVerify(props) {
  const {navigation, route} = props;
  const {navigate} = props.navigation;
  const email = route.params.email ? route.params.email : '';
  const fromSignUp = route.params.fromSignUp;

  //const email = 'umat415@gmail.com';

  const [box1, setBox1] = useState('');
  const [box2, setBox2] = useState('');
  const [box3, setBox3] = useState('');

  const [box4, setBox4] = useState('');
  const [box5, setBox5] = useState('');
  const [box6, setBox6] = useState('');

  const [isGenerateOtp, setIsGenerateOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const ref_input6 = useRef();

  const clearBoxes = () => {
    setBox1('');
    setBox2('');
    setBox3('');
    setBox4('');
    setBox5('');
    setBox6('');
  };

  useEffect(() => {
    console.log(fromSignUp);
    if (fromSignUp == 1 || fromSignUp == 2) {
      if (isGenerateOtp === false) {
        generateOtp();
      }
    }
  });

  const generateOtp = () => {
    const data = {email};
    Network('/generate-otp', 'post', data)
      .then(async (response) => {
        setIsGenerateOtp(true);
        if (response.response_code === 2000) {
          console.log('Hello', response);
          // Toast.show('OTP verified successfully');
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show(response.response_message);
          clearBoxes();
        }
      })
      .catch((error) => {
        setLoading(false);
        clearBoxes();
        Toast.show(error);
      });
  };

  const resetPasswordOtp = () => {
    const data = {email};
    Network('/generate-fp-otp', 'post', data)
      .then(async (response) => {
        setIsGenerateOtp(true);
        if (response.response_code === 2000) {
          console.log('Hello', response);
          Toast.show(response.response_message);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show(response.response_message);
          clearBoxes();
        }
      })
      .catch((error) => {
        setLoading(false);
        clearBoxes();
        Toast.show(error);
      });
  };

  const submitOtp = () => {
    setLoading(true);
    const otp = `${box1}${box2}${box3}${box4}${box5}${box6}`;
    var data = '';
    var urlEndPoint = '';
    if (fromSignUp == 1 || fromSignUp == 2) {
      data = {email, otp};
      urlEndPoint = '/verify-otp';
    } else {
      data = {email, forgot_password_otp: otp};
      urlEndPoint = '/verify-fp-otp';
    }
    Network(urlEndPoint, 'post', data)
      .then(async (res) => {
        console.log('Hello', JSON.stringify(res));
        if (res.response_code === 2000) {
          // await AsyncStorage.setItem(
          //   '@user',
          //   JSON.stringify(response.response),
          // );
          // dispatch(loginUser(response.response));

          setLoading(false);
          if (fromSignUp == 1) {
            navigate('Login');
          } else if (fromSignUp == 2) {
            navigate('Login');
          } else {
            navigate('NewPass', {otpId: res.response_data._id});
          }
          Toast.show(res.response_message);
        } else {
          setLoading(false);
          Toast.show(res.response_message);

          clearBoxes();
        }
      })
      .catch((error) => {
        setLoading(false);
        clearBoxes();
        Toast.show(error);
      });
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Check your E-mail, we have sent you the pin at{' '}
          <Text style={styles.emailText}>{email}</Text>
        </Text>
      </View>

      <View style={styles.otpInput}>
        <TextInput
          style={styles.optBox}
          value={box1}
          onChangeText={(text) => {
            setBox1(text);
            ref_input2.current.focus();
          }}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
        />
        <TextInput
          style={styles.optBox}
          value={box2}
          onChangeText={(text) => {
            setBox2(text);
            ref_input3.current.focus();
          }}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          ref={ref_input2}
        />
        <TextInput
          style={styles.optBox}
          value={box3}
          onChangeText={(text) => {
            setBox3(text);
            ref_input4.current.focus();
          }}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          ref={ref_input3}
        />
        <TextInput
          style={styles.optBox}
          value={box4}
          onChangeText={(text) => {
            setBox4(text);
            ref_input5.current.focus();
          }}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          ref={ref_input4}
        />
        <TextInput
          style={styles.optBox}
          value={box5}
          onChangeText={(text) => {
            setBox5(text);
            ref_input6.current.focus();
          }}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          ref={ref_input5}
        />
        <TextInput
          style={styles.optBox}
          value={box6}
          onChangeText={(text) => setBox6(text)}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="done"
          ref={ref_input6}
        />
      </View>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          if (fromSignUp == 1 || fromSignUp == 2) {
            generateOtp();
          } else {
            resetPasswordOtp();
          }
        }}>
        <Text style={styles.emailText}>Didn't receive email ?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => submitOtp()}
          width="80%"
          title="Continue"
          type=""
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '20%',
    backgroundColor: COLORS.WHITE,
  },
  textContainer: {
    width: '80%',
    alignItems: 'center',
  },
  text: {
    color: COLORS.GRAY,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.LARGE,
    textAlign: 'center',
  },
  emailText: {
    color: COLORS.PRIMARY,
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.MEDIUM,
  },
  otpInput: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: HEIGHT * 0.04,
  },
  optBox: {
    width: WIDTH * 0.13,
    height: HEIGHT * 0.06,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.GRAY,
    textAlign: 'center',
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    color: COLORS.SECONDARY,
    fontSize: FONT.SIZE.LARGE,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
    alignItems: 'center',
  },
});
