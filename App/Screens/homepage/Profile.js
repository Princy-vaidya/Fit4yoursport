import React, {useState, useEffect, useCallback} from 'react';
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
  SafeAreaView,
  Alert,
  FlatList,
  Picker,
  PermissionsAndroid,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalStyle} from '../../Utils/styles';
import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import {name, dial_code, code} from '../../Utils/country.json';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LoginInput from '../../Components/Inputs/loginInput';
import Button from '../../Components/Common/Button';
import {Validate} from '../../Components/Inputs/signupValidate';
import {Formik} from 'formik';
import Network from '../../Services/Network';
import Loader from '../../Components/Common/Loader';
import Toast from 'react-native-simple-toast';
import Header from '../../Utils/Header';
import moment from 'moment';
import {TimePickerModal} from 'react-native-paper-dates';
import {
  getToken,
  getUserId,
  setUserProfileImage,
  getUserType,
  setUserName,
} from '../../Utils/Preference';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dialog from '../common/Dialog';
import ImagePicker from 'react-native-image-picker';
import {saveUserProfile} from '../../redux/actions/saveUserProfileAction';
import {connect} from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

function Profile(props, saveUserProfile) {
  const {navigate} = props.navigation;
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('Country');
  const [height, setHeight] = useState('feet');
  const [weight, setWeight] = useState('kg');
  const [heightValue, setHeightValue] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [chestValue, setChestValue] = useState('');

  const [countryDialogVisible, setCountryDialogVisible] = useState(false);
  const [isprivacyPolicy, setIsprivacyPolicy] = useState(false);
  const customData = require('../../Utils/country.json');
  const [userProfileData, setUserProfileData] = useState({});
  const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
  const [isActivitiesDay1, setIsActivitiesDay1] = useState(false);
  const [isActivitiesDayLast, setIsActivitiesDayLast] = useState(false);
  const [isActivitiesMorTime, setIsActivitiesMorTime] = useState(false);

  const [dateNew, setDateNew] = useState(new Date());
  const [modeNew, setModeNew] = useState('date');
  const [showNew, setShowNew] = useState(false);
  const [isStartTime, setStartTime] = useState(false);
  const [userType, setUserType] = useState('');
  const [description, setDescription] = useState('');
  const [visibleTime, setVisibleTime] = useState(false);
  const [visibleEndTime, setVisibleEndTime] = useState(false);

  const [time, setTime] = useState('00:00');
  const [endtime, setEndTime] = useState('00:00');

  const [isInjuries, setIsInjuries] = useState(true);

  var name = '';
  const [firstName, setFirstName] = useState('');
  const [activityName, setActivityName] = useState({
    name: 'Sport',
  });

  const [availibileDay1, setAvailibleDay1] = useState({
    name: 'First Day',
  });
  const [availibileDaylast, setAvailibileDaylast] = useState({
    name: 'Last Day',
  });

  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [genderActivitiesDialog, setGenderActivitiesDialog] = useState(false);
  const [genderName, setGenderName] = useState({
    name: 'Gender',
  });
  const [genderList, setGenderList] = useState([
    {
      _id: '5fb3c0bb53d0970900fa5j1h',
      name: 'Male',
    },
    {
      _id: '5fb3c0bb53d0970900fa5j1l',
      name: 'Female',
    },
  ]);
  const [weightActivitiesDialog, setweightActivitiesDialog] = useState(false);
  const [weightName, setWeightName] = useState({
    name: 'Kg',
  });
  const [weightList, setWeightList] = useState([
    {
      _id: '5fb3c0bb53d0970900fa5j1h',
      name: 'Kg',
    },
    {
      _id: '5fb3c0bb53d0970900fa5j1l',
      name: 'Pound',
    },
  ]);
  const [heightActivitiesDialog, setHeightActivitiesDialog] = useState(false);
  const [chestActivitiesDialog, setChestActivitiesDialog] = useState(false);

  const [heightName, setHeightName] = useState({
    name: 'feet',
  });

  const [chestName, setChestName] = useState({
    name: 'inch',
  });
  const [heightList, setHeightList] = useState([
    {
      _id: '5fb3c0bb53d0970900fa5j1h',
      name: 'feet',
    },
    {
      _id: '5fb3c0bb53d0970900fa5j1l',
      name: 'meter',
    },
  ]);

  const [chestList, setChestList] = useState([
    {
      name: 'inch',
    },
  ]);
  const [lastName, setLastName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [dob, setDOB] = useState(moment());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [injuryText, setInjuryText] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [imagePickeDialog, setImagePickeDialog] = useState(false);
  const [day1, setDay1] = useState([
    {name: 'Monday'},
    {name: 'Tuesday'},
    {name: 'Wednesday'},
    {name: 'Thursday'},
    {name: 'Friday'},
    {name: 'Saturday'},
    {name: 'Sunday'},
  ]);
  const [daylast, setDaylast] = useState([
    {name: 'Monday'},
    {name: 'Tuesday'},
    {name: 'Wednesday'},
    {name: 'Thursday'},
    {name: 'Friday'},
    {name: 'Saturday'},
    {name: 'Sunday'},
  ]);

  useEffect(function () {
    token();
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Camera Permission',
          message: 'Fit4yourSport needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      const type = await getUserType();

      // getProfileData(token, id);
      setUserType(type);
      getExerciseList(token);
      setAuthToken(token);
      setUserId(id);
      getProfileData(id, token);
    } catch (e) {}
  };

  const onChangeNew = async (event, selectedDate) => {
    let currentDate = selectedDate || date;
    setShowNew(Platform.OS === 'ios');
    await setDateNew(currentDate);
    // alert(date)

    let hour = selectedDate.getHours();
    let TimeType = '';

    if (hour <= 11) {
      TimeType = 'AM';
    } else {
      TimeType = 'PM';
    }

    if (hour > 12) {
      hour = hour - 12;
    }
    if (hour == 0) {
      hour = 12;
    }

    let minutes = selectedDate.getMinutes();

    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }

    let fullTime =
      hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();
    console.log('full', fullTime);
    // setStartTime(fullTime)

    if (isStartTime) {
      // setStartTime(getTimeFromDateTime(currentDate));
      setTime(fullTime);
    } else {
      // setEndTime(getTimeFromDateTime(currentDate));
      setEndTime(fullTime);
    }
  };

  const showModeNew = (currentMode) => {
    setShowNew(true);
    setModeNew(currentMode);
  };

  const showDatepickerNew = () => {
    showModeNew('date');
  };

  const showTimepickerNew = (timeType) => {
    setStartTime(timeType);
    showModeNew('time');
  };

  const getExerciseList = (token) => {
    Network('/list-all-exercise', 'get', '', token)
      .then(function (response) {
        setExerciseList(response.response_data);
        s;
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const getProfileData = async (id, token) => {
    // const token = await getToken();
    // const id = await getUserId();

    console.log('url', '/view-profile?_id=' + id);
    Network('/view-profile?_id=' + id, 'get', '', token)
      .then(function (response) {
        const data = response.response_data;
        console.log('dataprofile', JSON.stringify(response));
        setUserProfileData(data);
        setFirstName(data.fname);
        setLastName(data.lname);
        setUserImage(data.profile_image);
        setUserProfileImage(data.profile_image);
        // var userDetails = {};
        // userDetails.profileImage = data.profile_image;
        // props.reduxSaveUserDetail(userDetails);
        setUserName(data.fname);
        setIsDateSelected(true);
        setDOB(data.dob);
        setCountryCode(data.country);
        // setGender(data.gender);
        setDescription(data.description);
        setGenderName({name: data.gender});
        setActivityName({name: data.sports});
        setHeightValue(data.height.height);
        setHeightName({name: data.height.type});
        setChestValue(data.chest.chest);
        setChestName({name: data.chest.type});
        setWeightValue(data.weight.weight);
        setWeightName({name: data.weight.type});
        setAvailibleDay1({name: data.availability.start_day});
        setAvailibileDaylast({name: data.availability.end_day});
        setTime(data.availability.start_time);
        setEndTime(data.availability.end_time);

        if (data.injuries == 'yes') {
          setIsInjuries(true);
        } else {
          setIsInjuries(false);
        }
        setInjuryText(data.injury_details);
      })
      .catch(function (error) {
        console.log('errror failed', JSON.stringify(error));
      });
  };

  const submitAction = (values) => {
    let email = values.email.toLowerCase();

    console.log(values.cpassword);

    if (firstName == '') {
      Toast.show('Please Enter First Name');
    } else if (lastName == '') {
      Toast.show('Please Enter Last Name');
    } else if (isDateSelected == false) {
      Toast.show('Please select date of birth');
    } else if (genderName == 'Gender') {
      Toast.show('Please select gender');
    } else if (countryCode == 'Country') {
      Toast.show('Please select country');
    } else if (activityName.name == 'Sport') {
      Toast.show('Please select sport');
    } else if (weightValue == '') {
      Toast.show('Please select weight');
    } else if (heightValue == '') {
      Toast.show('Please select height');
    } else {
      setLoading(true);

      const data = {
        _id: userId,
        fname: firstName,
        lname: lastName,
        // dob: convertUTCDateToLocalDate(dob),
        dob: dob,
        country: countryCode,
        gender: genderName.name,
        sports: activityName.name,
        height: {height: heightValue, type: heightName.name},
        weight: {weight: weightValue, type: weightName.name},
        chest: {chest: chestValue, type: chestName.name},

        description: description,
        availability: {
          start_day: availibileDay1.name,
          end_day: availibileDaylast.name,
          start_time: time,
          end_time: endtime,
        },
        injuries: isInjuries ? 'yes' : 'no',
        injury_details: isInjuries ? injuryText : '',
      };
      console.log('data--------', data);
      Network('/edit-profile', 'post', data, authToken)
        .then((res) => {
          console.log(JSON.stringify(res));
          setLoading(false);
          if (res.response_code == 2000) {
            Toast.show(res.response_message);
          }
          if (res.response_code == 4000) {
            Toast.show(res.response_message);
          } else {
            Toast.show(res.response_message);

            console.log(JSON.stringify(res.response_message));
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show(error);
        });
    }
  };

  const uploadImage = async (res) => {
    let data = new FormData();
    data.append('_id', userId);
    data.append('profile_image', {
      uri: res,
      name: Date.parse(new Date()) + 'photo.png',
      filename: 'imageName.png',
      type: 'image/png',
    });

    console.log('Data', data);

    Network('/edit-profileImage', 'POST', data, authToken)
      .then((res) => {
        console.log('uploadimage Successful==>' + JSON.stringify(res));
        if (res.response_code == 2000) {
          setUserProfileImage(res.response_data);
          // setUserImage(res.response_data);
        } else {
          Toast.show(res.response_message);
          setUserImage('');
        }
      })
      .catch((err) => {
        console.log('Error --' + JSON.stringify(err));
      });
  };

  const cameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = res.uri;
        uploadImage(source);
        setUserImage(source);

        setImagePickeDialog(false);
      }
    });
  };

  const onEditPress = () => {
    var options = {
      title: 'Select Image',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };

    // if (name === 'Take_Photo') {
    ImagePicker.showImagePicker(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log('Response image', response);
        const pic =
          Platform.OS === 'android'
            ? response.uri
            : response.uri.replace('file://', '');

        setUserImage(pic);

        const token = await getToken();
        const id = await getUserId();
        let formdata = new FormData();
        formdata.append('_id', id);
        formdata.append('profile_image', {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          name: 'abc.jpg',
          type: response.type,
          // filename:response.fileName

          // name: userImage.substring(userImage.lastIndexOf('/') + 1, userImage.length),
          // type: userImage.substring(userImage.lastIndexOf('.') + 1, userImage.length)
        });
        console.log('formdata', formdata);
        setLoading(true);
        Network('/edit-profileImage', 'POST', formdata, token)
          .then(async (res) => {
            console.log('uploadimage Successful==>' + JSON.stringify(res));

            if (res.response_code == 2000) {
              Toast.show(res.response_message, Toast.LONG);
              await setUserProfileImage(res.response_data);
              await setUserImage(res.response_data);

              var userDetails = {};
              userDetails.profileImage = res.response_data;

              props.reduxSaveUserDetail(userDetails);
              console.log('fff', props.reduxSaveUserDetail(userDetails));

              console.log('profilepic', props);
              setUserImage(props.userDetails.profileImage);

              setLoading(false);
              console.log('ddddppp', res.response_message);
              console.log(userImage);

              const pic =
                Platform.OS === 'android'
                  ? response.uri
                  : response.uri.replace('file://', '');

              setUserImage(pic);

              //  getProfileData(id,token);
            } else {
              await setUserImage(res.response_data);
              await setUserImage(res.response_data);

              console.log('dfff', res.response_message);
            }
          })
          .catch((err) => {
            console.log('Error --' + err);
          });
      }
    });
  };

  const imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = res.uri;
        uploadImage(source);
        setUserImage(source);
        setImagePickeDialog(false);
      }
    });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDOB(currentDate);

    setIsDateSelected(true);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onDismissTime = React.useCallback(() => {
    setVisibleTime(false);
  }, [setVisibleTime]);

  const onConfirmTime = React.useCallback(
    ({hours, minutes}) => {
      setVisibleTime(false);

      let TimeType = '';

      if (hours <= 11) {
        TimeType = 'AM';
      } else {
        TimeType = 'PM';
      }

      if (hours > 12) {
        hours = hours - 12;
      }
      if (hours == 0) {
        hours = 12;
      }

      const s = `${hours}:${minutes} ${TimeType}`;
      setTime(s);
    },
    [setVisibleTime],
  );

  const onDismissEndTime = React.useCallback(() => {
    setVisibleEndTime(false);
  }, [setVisibleEndTime]);

  const onConfirmEndTime = React.useCallback(
    ({hours, minutes}) => {
      setVisibleEndTime(false);

      let TimeType = '';

      if (hours <= 11) {
        TimeType = 'AM';
      } else {
        TimeType = 'PM';
      }

      if (hours > 12) {
        hours = hours - 12;
      }
      if (hours == 0) {
        hours = 12;
      }

      const endtime = `${hours}:${minutes} ${TimeType}`;
      setEndTime(endtime);
    },
    [setVisibleEndTime],
  );

  const convertUTCDateToLocalDate = (datetime) => {
    var fullDate = new Date(datetime);
    console.log(fullDate);
    var twoDigitMonth = fullDate.getMonth() + '';
    if (twoDigitMonth.length == 1) twoDigitMonth = '0' + twoDigitMonth;
    var twoDigitDate = fullDate.getDate() + '';
    if (twoDigitDate.length == 1) twoDigitDate = '0' + twoDigitDate;
    var currentDate =
      twoDigitDate +
      '-' +
      (Number(twoDigitMonth) + 1) +
      '-' +
      fullDate.getFullYear();
    console.log(currentDate);
    return currentDate;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation} title="Profile" type="back" />

      <ScrollView>
        <Loader loading={loading} />
        <KeyboardAvoidingView style={{}}>
          {/* <View
            style={{ backgroundColor: '#949494', width: '100%' }}
          /> */}
          <Animatable.View animation="fadeInDown" style={styles.subContainer}>
            <TouchableOpacity onPress={() => onEditPress()}>
              <View
                style={{
                  alignItems: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: 100 / 2,
                }}>
                <ImageBackground
                  source={{uri: userImage, cache: 'only-if-cached'}}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100 / 2,
                    overflow: 'hidden',
                    borderWidth: 2,
                  }}>
                  <Text
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'black',
                      paddingHorizontal: 10,
                      width: 100,
                      height: 30,
                      textAlign: 'center',
                      color: 'white',
                    }}
                    opacity={0.9}>
                    Edit
                  </Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>

            <Formik
              initialValues={{
                email: '',
                fname: name,
                lname: userProfileData.lname,
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
                  {console.log('NNNN ', name)}
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
                      paddingHorizontal: 10,
                    }}>
                    <TextInput
                      placeholder="First Name"
                      value={firstName}
                      onChangeText={(text) => setFirstName(text)}
                      type="fname"
                      max={50}
                    />
                    {touched.fname && errors.fname && (
                      <Text style={styles.formError}>{errors.fname}</Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                      backgroundColor: COLORS.WHITE,
                      borderRadius: 4,
                      borderWidth: 0.5,
                      borderColor: COLORS.GRAY,
                      //margin: GAP.SMALL - 1,
                      height: HEIGHT * 0.0658,
                      marginVertical: GAP.SMALL,
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <TextInput
                      placeholder="Last Name"
                      value={lastName}
                      onChangeText={(text) => setLastName(text)}
                      type="email"
                      max={50}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.formError}>{errors.email}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                    activeOpacity={1}
                    onPress={() => showDatepicker()}>
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
                        paddingHorizontal: 10,
                      }}>
                      <TextInput
                        editable={false}
                        placeholder="Date Of Birth"
                        value={
                          //  isDateSelected ? convertUTCDateToLocalDate(dob) : ''
                          moment(dob).format('MM-DD-YYYY') !== 'Invalid date' &&
                          moment(dob).format('MM-DD-YYYY')
                        }
                        style={{color: COLORS.BLACK}}
                      />

                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/calendar.png')}
                        style={styles.icon}
                      />
                    </View>
                  </TouchableOpacity>

                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={false}
                      display="default"
                      onChange={onChange}
                      style={{width: 320, backgroundColor: 'white'}}
                    />
                  )}

                  <Dialog
                    isVisible={genderActivitiesDialog}
                    title="Gender"
                    onValueSelected={(value) => {
                      setGenderName(value);
                      setGenderActivitiesDialog(value);
                    }}
                    activityList={genderList}
                    onCancel={() => setGenderActivitiesDialog(false)}
                  />
                  <TouchableOpacity
                    style={{
                      width: '100%',
                    }}
                    activeOpacity={1}
                    onPress={() => setGenderActivitiesDialog(true)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 4,
                        borderWidth: 0.5,
                        borderColor: COLORS.GRAY,
                        //margin: GAP.SMALL - 1,
                        height: HEIGHT * 0.0658,
                        marginVertical: GAP.SMALL,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <TextInput
                        editable={false}
                        placeholder="Gender"
                        value={genderName.name}
                        onChange={handleChange('email')}
                        type="email"
                        onBlur={() => setFieldTouched('email')}
                        max={50}
                        style={{color: COLORS.BLACK}}
                      />

                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/down-arrow.png')}
                        style={styles.icon}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      width: '100%',
                    }}
                    onPress={() => {
                      setCountryDialogVisible(true);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 4,
                        borderWidth: 0.5,
                        borderColor: COLORS.GRAY,
                        //margin: GAP.SMALL - 1,
                        height: HEIGHT * 0.0658,
                        marginVertical: GAP.SMALL,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <TextInput
                        editable={false}
                        placeholder="Country"
                        value={countryCode}
                        onChange={handleChange('email')}
                        type="email"
                        onBlur={() => setFieldTouched('email')}
                        max={50}
                        style={{color: COLORS.BLACK}}
                      />

                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/down-arrow.png')}
                        style={styles.icon}
                      />
                    </View>
                  </TouchableOpacity>
                  <Dialog
                    isVisible={isActivitiesDialog}
                    title="Sport List"
                    onValueSelected={(value) => {
                      setActivityName(value);
                      setIsActivitiesDialog(value);
                    }}
                    activityList={exerciseList}
                    onCancel={() => setIsActivitiesDialog(false)}
                  />
                  <TouchableOpacity
                    style={{
                      width: '100%',
                    }}
                    activeOpacity={1}
                    onPress={() => setIsActivitiesDialog(true)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 4,
                        borderWidth: 0.5,
                        borderColor: COLORS.GRAY,
                        //margin: GAP.SMALL - 1,
                        height: HEIGHT * 0.0658,
                        marginVertical: GAP.SMALL,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <TextInput
                        editable={false}
                        placeholder="Sport"
                        value={activityName.name}
                        onChange={handleChange('email')}
                        type="email"
                        onBlur={() => setFieldTouched('email')}
                        max={50}
                        style={{color: COLORS.BLACK}}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.formError}>{errors.email}</Text>
                      )}
                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/down-arrow.png')}
                        style={styles.icon}
                      />
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                      backgroundColor: COLORS.WHITE,
                      borderRadius: 4,
                      borderWidth: 0.5,
                      borderColor: COLORS.GRAY,
                      //margin: GAP.SMALL - 1,
                      height: HEIGHT * 0.0658,
                      marginVertical: GAP.SMALL,
                      alignItems: 'center',
                      paddingStart: 10,
                    }}>
                    <TextInput
                      placeholder="Weight"
                      value={weightValue}
                      keyboardType="numeric"
                      onChangeText={(text) => setWeightValue(text)}
                      max={50}
                      style={{color: COLORS.BLACK}}
                    />

                    <View
                      style={{
                        width: '35%',
                        height: '100%',
                        flexDirection: 'row',
                        backgroundColor: '#F1F1F1',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        paddingLeft: 10,
                      }}>
                      <View style={{flex: 1, backgroundColor: 'white'}}>
                        <Dialog
                          isVisible={weightActivitiesDialog}
                          title="Weight"
                          onValueSelected={(value) => {
                            setWeightName(value);
                            setweightActivitiesDialog(value);
                          }}
                          activityList={weightList}
                          onCancel={() => setweightActivitiesDialog(false)}
                        />
                      </View>
                      <View
                        style={{
                          width: '100%',
                          position: 'absolute',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => setweightActivitiesDialog(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{color: COLORS.BLACK, paddingLeft: 10}}>
                              {weightName.name}
                            </Text>
                            <AntDesign
                              name="down"
                              size={20}
                              style={{color: COLORS.BLACK}}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
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
                      placeholder="Height"
                      value={heightValue}
                      keyboardType="numeric"
                      onChangeText={(text) => setHeightValue(text)}
                      max={50}
                      style={{color: COLORS.BLACK}}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.formError}>{errors.email}</Text>
                    )}
                    <View
                      style={{
                        width: '35%',
                        height: '100%',
                        flexDirection: 'row',
                        backgroundColor: '#F1F1F1',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        paddingLeft: 10,
                      }}>
                      <View style={{flex: 1, backgroundColor: 'white'}}>
                        <Dialog
                          isVisible={heightActivitiesDialog}
                          title="Height"
                          onValueSelected={(value) => {
                            setHeightName(value);
                            setHeightActivitiesDialog(value);
                          }}
                          activityList={heightList}
                          onCancel={() => setHeightActivitiesDialog(false)}
                        />
                      </View>

                      <View
                        style={{
                          width: '100%',
                          position: 'absolute',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => setHeightActivitiesDialog(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{color: COLORS.BLACK, paddingLeft: 10}}>
                              {heightName.name}
                            </Text>
                            <AntDesign
                              name="down"
                              size={20}
                              style={{color: COLORS.BLACK}}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {userType === 'trainer' && (
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
                        placeholder="Chest"
                        value={chestValue}
                        keyboardType="numeric"
                        onChangeText={(text) => setChestValue(text)}
                        max={50}
                        style={{color: COLORS.BLACK}}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.formError}>{errors.email}</Text>
                      )}
                      <View
                        style={{
                          width: '35%',
                          height: '100%',
                          flexDirection: 'row',
                          backgroundColor: '#F1F1F1',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          paddingLeft: 10,
                        }}>
                        <View style={{flex: 1, backgroundColor: 'white'}}>
                          <Dialog
                            isVisible={chestActivitiesDialog}
                            title="Chest"
                            onValueSelected={(value) => {
                              setChestName(value);
                              setChestActivitiesDialog(value);
                            }}
                            activityList={chestList}
                            onCancel={() => setChestActivitiesDialog(false)}
                          />
                        </View>

                        <View
                          style={{
                            width: '100%',
                            position: 'absolute',
                            justifyContent: 'flex-end',
                          }}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setChestActivitiesDialog(true)}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{color: COLORS.BLACK, paddingLeft: 10}}>
                                {chestName.name}
                              </Text>
                              <AntDesign
                                name="down"
                                size={20}
                                style={{color: COLORS.BLACK}}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  {userType === 'trainer' && (
                    <View
                      style={{
                        // flexDirection: 'row',
                        width: '100%',
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 4,
                        borderWidth: 0.5,
                        borderColor: COLORS.GRAY,
                        paddingHorizontal: 10,
                        paddingTop: 7,
                        height: 100,
                        marginTop: 10,
                      }}>
                      <TextInput
                        placeholder="Describe yourself"
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        style={{color: COLORS.BLACK}}
                      />
                    </View>
                  )}
                  <View>
                    {userType === 'trainer' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.FAMILY.SEMI_BOLD,
                              textAlignVertical: 'center',
                            }}>
                            {' '}
                            Available on Days{' '}
                          </Text>
                        </View>
                        <View>
                          <Dialog
                            isVisible={isActivitiesDay1}
                            title="Availible Days"
                            onValueSelected={(value) => {
                              setAvailibleDay1(value);
                              setIsActivitiesDay1(value);
                            }}
                            activityList={day1}
                            onCancel={() => setIsActivitiesDay1(false)}
                          />
                          <TouchableOpacity
                            style={
                              {
                                // width: '50%',
                              }
                            }
                            activeOpacity={1}
                            onPress={() => setIsActivitiesDay1(true)}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                // width: '100%',
                                // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                                backgroundColor: COLORS.WHITE,
                                borderRadius: 4,
                                borderWidth: 0.5,
                                borderColor: COLORS.GRAY,
                                //margin: GAP.SMALL - 1,
                                height: HEIGHT * 0.0658,
                                marginVertical: GAP.SMALL,
                                alignItems: 'center',
                                paddingHorizontal: 5,
                              }}>
                              <TextInput
                                editable={false}
                                placeholder="First Day"
                                value={availibileDay1.name}
                                onChange={handleChange('email')}
                                type="email"
                                onBlur={() => setFieldTouched('email')}
                                max={50}
                                style={{color: COLORS.BLACK}}
                              />
                              {touched.email && errors.email && (
                                <Text style={styles.formError}>
                                  {errors.email}
                                </Text>
                              )}
                              <Image
                                resizeMode="contain"
                                source={require('../../Assets/Auths/down-arrow.png')}
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.FAMILY.SEMI_BOLD,
                              textAlignVertical: 'center',
                            }}>
                            {' '}
                            to{' '}
                          </Text>
                        </View>
                        <View>
                          <Dialog
                            isVisible={isActivitiesDayLast}
                            title="Availible Days"
                            onValueSelected={(value) => {
                              setAvailibileDaylast(value);
                              setIsActivitiesDayLast(value);
                            }}
                            activityList={daylast}
                            onCancel={() => setIsActivitiesDayLast(false)}
                          />
                          <TouchableOpacity
                            style={
                              {
                                // width: '50%',
                              }
                            }
                            activeOpacity={1}
                            onPress={() => setIsActivitiesDayLast(true)}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                // width: '100%',
                                // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                                backgroundColor: COLORS.WHITE,
                                borderRadius: 4,
                                borderWidth: 0.5,
                                borderColor: COLORS.GRAY,
                                //margin: GAP.SMALL - 1,
                                height: HEIGHT * 0.0658,
                                marginVertical: GAP.SMALL,
                                alignItems: 'center',
                                paddingHorizontal: 5,
                              }}>
                              <TextInput
                                editable={false}
                                placeholder="End Day"
                                value={availibileDaylast.name}
                                onChange={handleChange('email')}
                                type="email"
                                onBlur={() => setFieldTouched('email')}
                                max={50}
                                style={{color: COLORS.BLACK}}
                              />
                              {touched.email && errors.email && (
                                <Text style={styles.formError}>
                                  {errors.email}
                                </Text>
                              )}
                              <Image
                                resizeMode="contain"
                                source={require('../../Assets/Auths/down-arrow.png')}
                                style={styles.icon}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {userType === 'trainer' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.FAMILY.SEMI_BOLD,
                              textAlignVertical: 'center',
                            }}>
                            {' '}
                            Available on Time{' '}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={
                            {
                              // width: '50%',
                            }
                          }
                          activeOpacity={1}
                          onPress={() => setVisibleTime(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // width: '100%',
                              // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                              backgroundColor: COLORS.WHITE,
                              borderRadius: 4,
                              borderWidth: 0.5,
                              borderColor: COLORS.GRAY,
                              //margin: GAP.SMALL - 1,
                              height: HEIGHT * 0.0658,
                              marginVertical: GAP.SMALL,
                              alignItems: 'center',
                              paddingHorizontal: 5,
                            }}>
                            <Text style={styles.title}>{time}</Text>
                            {touched.email && errors.email && (
                              <Text style={styles.formError}>
                                {errors.email}
                              </Text>
                            )}
                            <Image
                              resizeMode="contain"
                              source={require('../../Assets/Auths/down-arrow.png')}
                              style={styles.icon}
                            />
                          </View>
                        </TouchableOpacity>

                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.FAMILY.SEMI_BOLD,
                              textAlignVertical: 'center',
                            }}>
                            {' '}
                            to{' '}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={
                            {
                              // width: '50%',
                            }
                          }
                          activeOpacity={1}
                          onPress={() => setVisibleEndTime(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // width: '100%',
                              // backgroundColor: '#b7014863', //COLORS.TRANSPARENT,
                              backgroundColor: COLORS.WHITE,
                              borderRadius: 4,
                              borderWidth: 0.5,
                              borderColor: COLORS.GRAY,
                              //margin: GAP.SMALL - 1,
                              height: HEIGHT * 0.0658,
                              marginVertical: GAP.SMALL,
                              alignItems: 'center',
                              paddingHorizontal: 5,
                            }}>
                            <Text style={styles.title}>{endtime}</Text>
                            {touched.email && errors.email && (
                              <Text style={styles.formError}>
                                {errors.email}
                              </Text>
                            )}
                            <Image
                              resizeMode="contain"
                              source={require('../../Assets/Auths/down-arrow.png')}
                              style={styles.icon}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    {/* {showNew && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dateNew}
                        mode={modeNew}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeNew}
                      />
                    )} */}

                    <TimePickerModal
                      visible={visibleTime}
                      onDismiss={onDismissTime}
                      onConfirm={onConfirmTime}
                      // hours={12} // default: current hours
                      // minutes={14} // default: current minutes
                      label="Select time" // optional, default 'Select time'
                      cancelLabel="Cancel" // optional, default: 'Cancel'
                      confirmLabel="Ok" // optional, default: 'Ok'
                      animationType="fade" // optional, default is 'none'
                      locale={'en'}
                    />

                    <TimePickerModal
                      visible={visibleEndTime}
                      onDismiss={onDismissEndTime}
                      onConfirm={onConfirmEndTime}
                      // hours={12} // default: current hours
                      // minutes={14} // default: current minutes
                      label="Select time" // optional, default 'Select time'
                      cancelLabel="Cancel" // optional, default: 'Cancel'
                      confirmLabel="Ok" // optional, default: 'Ok'
                      animationType="fade" // optional, default is 'none'
                      locale={'en'}
                    />
                  </View>

                  {userType === 'user' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text onPress={props.onPress} style={styles.agreeText}>
                        Injuries Past/Present:
                      </Text>
                      <TouchableOpacity
                        style={{paddingStart: 10}}
                        onPress={() => setIsInjuries(true)}>
                        <Image
                          style={
                            isInjuries
                              ? {
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.2,
                                  borderColor: COLORS.BLACK,
                                  backgroundColor: 'red',
                                  borderRadius: 7.5,
                                  marginRight: 10,
                                }
                              : {
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.2,
                                  borderColor: COLORS.BLACK,
                                  borderRadius: 7.5,
                                  backgroundColor: 'white',
                                  marginRight: 10,
                                }
                          }
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{padding: 4}}
                        onPress={() => setIsInjuries(false)}>
                        <Image
                          style={
                            !isInjuries
                              ? {
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.2,
                                  borderColor: COLORS.BLACK,
                                  borderRadius: 7.5,
                                  backgroundColor: 'red',
                                  marginStart: 20,
                                }
                              : {
                                  height: 15,
                                  width: 15,
                                  borderWidth: 0.2,
                                  borderColor: COLORS.BLACK,
                                  backgroundColor: 'white',
                                  borderRadius: 7.5,
                                  marginStart: 20,
                                }
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {isInjuries && userType === 'user' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 4,
                        borderWidth: 0.5,
                        borderColor: COLORS.GRAY,
                        paddingHorizontal: 10,
                        alignItems: 'flex-start',
                        height: 100,
                      }}>
                      <TextInput
                        placeholder="Describe your injury"
                        value={injuryText}
                        onChangeText={(text) => setInjuryText(text)}
                        style={{color: COLORS.BLACK}}
                      />
                    </View>
                  )}

                  {/* <TouchableOpacity 
                    style={{ flexDirection: 'row', marginTop: 30 }}
                    // onPress={()=>props.navigation.navigate('NewPass')}
                    >
                      <Text
                        style={{
                          color: COLORS.RED,
                          fontFamily: FONT.FAMILY.BOLD,
                          fontSize: 16,
                        }}>
                        {' '}
                        Change Password
                    </Text>
                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/arrow.png')}
                        style={{
                          width: 15,
                          height: 15,
                          tintColor: COLORS.RED,
                          alignSelf: 'center',
                          marginLeft: 20,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 30,
                        marginBottom: 20,
                      }}>
                      <Text
                        style={{
                          color: COLORS.RED,
                          fontFamily: FONT.FAMILY.BOLD,
                          fontSize: 16,
                        }}>
                        Payment Method
                    </Text>
                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Auths/arrow.png')}
                        style={{
                          width: 15,
                          height: 15,
                          tintColor: COLORS.RED,
                          alignSelf: 'center',
                          marginLeft: 20,
                        }}
                      />
                    </View> */}

                  <Button
                    onPress={() => submitAction(values)}
                    type="white"
                    title="Save"
                  />
                </>
              )}
            </Formik>
          </Animatable.View>
        </KeyboardAvoidingView>
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
                      setCountryCode(item.name);
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

      <Modal
        visible={imagePickeDialog}
        transparent={true}
        animationType={'fade'}
        onRequestClose={() => {
          setImagePickeDialog(!imagePickeDialog);
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
              backgroundColor: COLORS.WHITE,
              width: '80%',
              alignItems: 'center',
              borderRadius: 6,
              elevation: 4,
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontSize: 18,
                textAlign: 'center',
                paddingVertical: 20,
                marginTop: 10,
              }}
              onPress={cameraLaunch}>
              Take Photo
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.GRAY,
                width: '100%',
              }}
            />

            <Text
              style={{
                color: COLORS.BLACK,
                fontSize: 18,
                textAlign: 'center',
                paddingVertical: 10,
                marginTop: 10,
                fontFamily: 'Raleway-Bold',
              }}
              onPress={imageGalleryLaunch}>
              Choose Image From Gallery
            </Text>

            <View
              style={{
                height: 1,
                marginTop: 20,
                backgroundColor: COLORS.GRAY,
                width: '100%',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.GRAY,
                borderBottomStartRadius: 6,
                borderBottomEndRadius: 6,
              }}>
              <Text
                style={{
                  color: COLORS.DARKGRAY,
                  fontSize: 18,
                  padding: 10,
                  fontFamily: 'Raleway-Sembold',
                  textAlign: 'center',
                  flex: 1,
                }}
                onPress={() => {
                  setImagePickeDialog(false);
                }}>
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: HEIGHT,
    width: WIDTH,
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

  signIn: {
    color: COLORS.RED,
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
    marginVertical: GAP.SMALL,
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
    padding: HEIGHT * 0.0105,
    width: WIDTH * 0.4,
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
    width: 15,
    height: 15,
    tintColor: COLORS.BLACK,
    alignSelf: 'center',
    marginLeft: 4,
  },
});

const mapStateToProps = (state) => {
  return {
    userDetails: state.profileReducer.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSaveUserDetail: (userDetails) =>
      dispatch(saveUserProfile(userDetails)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
