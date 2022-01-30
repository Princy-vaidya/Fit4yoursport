import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, Image, SafeAreaView, Platform, TouchableOpacity, StyleSheet, TextInput, Platfom } from 'react-native';
import { HEIGHT, GAP, COLORS, FONT } from '../../Utils/constants';
import { getToken, getUserId, setSessionKey } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import Header from '../../Utils/Header';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Dialog from '../common/Dialog';
import Network from '../../Services/Network';
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const leftImage1 = require('../../Assets/Auths/Ellipse.png');
// const centerImage1 = require('../../Assets/Auths/Ellipse.png');

export default function MyAppoinment(props) {
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dob, setDOB] = useState(moment());
    const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
    const [type, setType] = useState([{ name: 'Chat' }, { name: 'Call' }]);

    const [isStartTime, setIsStartTime] = useState(true);
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:00');
    const [timeList, setTimeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState('')
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [trainerId, setTrainerId] = useState('')
    const [slotId, setSlotId] = useState('')


    useFocusEffect(
        React.useCallback(() => {
            token();
        }, []),
    );

    const token = async () => {
        try {
            const token = await getToken();
            const id = await getUserId();
            getUserSlot(token, id)

        } catch (e) { }
    };

    const getUserSlot = (token, id) => {
        setLoading(true)
        Network(`/user-appointment-list?user_id=${id}&page=1&limit=100`, 'get', '', token)
            .then((response) => {
                setLoading(false)
                if (response.response_data.docs.length != 0) {
                    setInvalid(false);
                    setMessage('');
                    setTimeList(response.response_data.docs)
                    //  alert(JSON.stringify(timeList))
                } else {
                    setInvalid(true);
                    setMessage('You have not taken appointment yet.');
                }

            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
    };



    const onEditTime = (item) => {
        setEdit(true)
        setShowModal(true);
        setStartTime(item.slotDetails.start_time)
        setEndTime(item.slotDetails.end_time)
        setEditId(item._id)
        setTrainerId(item.trainer_id)
        setSlotId(item.slot_id)
        setDOB(item.date)

        console.log('date', dob)
    }









    const onChange = (item) => {
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



    const onUpdateTime = async (editId, slotId, trainerId, dob) => {
        const token = await getToken();
        const id = await getUserId();


        setLoading(true);
        // const videoUrl=url.substring(32);
        let formdata = new FormData();

        formdata.append('slot_id', slotId)
        formdata.append('trainer_id', trainerId)
        formdata.append('date', dob)
        formdata.append('_id', editId)
        formdata.append('user_id', id)


        setLoading(true)
        Network('/add-edit-appointment', 'POST', formdata, token)
            .then(async (res) => {
                setLoading(false)
                if (res.response_code == 2000) {
                    Toast.show(res.response_message);

                    getUserSlot(token, id)
                }
                else {
                    Toast.show(res.response_message);
                }
            })
            .catch((err) => {
                console.log('Error --' + JSON.stringify(err));
                Toast.show(res.response_message);
            });
        setShowModal(false)
    }

    const returnSlotList = (item, index) => {
        console.log('item', item.date)
        return (

            <View style={{
                borderWidth: 1, margin: 10, padding: 10,
                borderColor: COLORS.GRAY,
                shadowColor: COLORS.GRAY,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 1,
                zIndex: 2,
            }}>


                <View style={{ flexDirection: 'row', width: '70%' }}>
                    <Image source={(item.trainerDetails.profile_image === null || item.trainerDetails.profile_image === undefined)
                        ?
                        require('../../Assets/Auths/user.png')
                        : { uri: item.trainerDetails.profile_image }}
                        style={styles.profilepic} />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{
                            fontSize: FONT.SIZE.LARGE,
                            fontFamily: FONT.FAMILY.SEMI_BOLD,
                            marginTop: 10
                        }}>
                            {item.trainerDetails.fname + " " + item.trainerDetails.lname}
                        </Text>
                    </View >
                </View>

                <View style={{
                    width: '100%',
                    margin: 10,
                    flexDirection: 'row',
                    // justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: FONT.SIZE.MEDIUM,
                        fontFamily: FONT.FAMILY.SEMI_BOLD
                    }}>Appoinment : </Text>
                    <Text style={{
                        ontSize: FONT.SIZE.MEDIUM,
                        fontFamily: FONT.FAMILY.REGULAR,
                        paddingTop: 3
                    }}>{item.appointment_type} </Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                    {/* <TouchableOpacity
                        style={{
                            //  flexDirection: 'row',
                            // justifyContent: 'space-between',
                            // width: '50%',
                        }}
                        activeOpacity={1}
                         onPress={() => showDatepicker()}
                        >
                        <View
                            style={styles.dateView}>
                            <TextInput
                                editable={false}
                                placeholder="Date Of Birth"
                                value={
                                    //  isDateSelected ? convertUTCDateToLocalDate(dob) : ''
                                   moment(item.date).format('YYYY-MM-DD')
                                }
                                style={{ color: COLORS.BLACK }}
                            />
                           <TouchableOpacity onPress={()=>showDatepicker()}>
                            <Image
                                resizeMode="contain"
                                source={require('../../Assets/Auths/calendar.png')}
                                style={{ width: 30, height: 30, tintColor: COLORS.RED }}
                            />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity> */}



                    <View
                        style={styles.dateView}>

                        <Text style={{
                            fontSize: FONT.SIZE.MEDIUM,
                            fontFamily: FONT.FAMILY.SEMI_BOLD
                        }}>Date:</Text>
                        <TextInput
                            editable={false}
                            placeholder="Date "
                            value={
                                //  isDateSelected ? convertUTCDateToLocalDate(dob) : ''
                                moment(item.date).format('YYYY-MM-DD')
                            }
                            style={{
                                color: COLORS.BLACK, ...Platform.select({
                                    android: {
                                        marginTop: -12
                                    },
                                    ios: {
                                        marginTop: 0
                                    }
                                })
                            }}
                        />
                       
                    </View>


                </View>

                <View style={styles.slotView}>

                    <View style={{ width: '60%', flexDirection: 'row' }}>
                        <View style={{ borderRightWidth: 0.5 }}>
                            <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>Slot</Text>
                        </View>
                        <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>{item.slotDetails.start_time} - {item.slotDetails.end_time}</Text>
                    </View>
                    

                   
                </View>
                <TouchableOpacity
                        style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: COLORS.PRIMARY,
                            padding: 5, width: '26%',
                            borderRadius: 5,
                            alignSelf:'flex-end',
                            margin:10
                        }}
                        onPress={() =>props.navigation.navigate('Appoinment',{
                            trainerId:item.trainer_id,
                            subType:item.appointment_type,
                            editId:item._id,
                            slotId:item.slot_id,
                            date:item.date})}>
                        <Text style={styles.textSmall}>Edit</Text>
                    </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
            <Header
                navigation={props.navigation}
                title='My Appoinment'
                type='back'
            />
            <Loader loading={loading} />
            {invalid &&
                <Text style={{
                    textAlign: 'center',
                    color: COLORS.RED,
                    fontFamily: FONT.FAMILY.REGULAR,
                    margin: 10
                }}>
                    {message}
                </Text>}
            <ScrollView style={{}}>

                <View style={{ margin: 10, marginBottom: 60 }}>


                    <FlatList
                        data={timeList}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        renderItem={({ item, index }) => returnSlotList(item, index)} />


                </View>

            </ScrollView>

            {/* <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.addButton}>
        <Image source={require('../../Assets/Auths/ADD.png')}
          style={styles.addImage} />
      </TouchableOpacity> */}





        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    addButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,

    },
    addImage: {
        alignSelf: 'flex-end',
        margin: 15,
        width: 55,
        height: 55
    },
    modalView: {
        backgroundColor: 'white',
        width: '70%',
        alignSelf: 'center',
        borderRadius: 15,
        borderTopRightRadius: 15
    },
    whiteText: {
        fontSize: FONT.SIZE.MEDIUM,
        textAlign: 'center',
        color: 'white',
        fontFamily: FONT.FAMILY.SEMI_BOLD,
        padding: 7
    },
    TextInputText: {
        marginLeft: 5,
        borderBottomWidth: 2,
        paddingBottom: 5,
        fontSize: FONT.SIZE.SMALL,
        borderBottomColor: COLORS.LIGHTGRAY,
        width: '95%',
        fontFamily: FONT.FAMILY.MEDIUM
    },
    youTubeTextView: {
        backgroundColor: COLORS.WHITE,
        borderTopStartRadius: 15,
        borderTopRightRadius: 15
    },
    addTextView: {
        backgroundColor: COLORS.PRIMARY,
        marginTop: 20,
        marginHorizontal: 45,
        borderRadius: 10,
        padding: 2,
        marginBottom: 15
    },
    addVideoText: {
        color: COLORS.BLACK,
        marginBottom: -15,
        textAlign: 'left',
        marginTop: 10
    },
    textSmall: {
        textAlign: 'center',
        color: COLORS.WHITE,
        fontSize: FONT.SIZE.SMALL,
        fontFamily: FONT.FAMILY.SEMI_BOLD
    },
    dateView: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        width: '100%',
        // backgroundColor: COLORS.WHITE,
        // borderRadius: 4,
        // borderWidth: 0.5,
        marginLeft: 17,
        // borderColor: COLORS.GRAY,
        // height: HEIGHT * 0.0658,
        // marginVertical: GAP.SMALL,
        // alignItems: 'center',
        // paddingHorizontal: 10,
    },
    slotView: {
        backgroundColor: COLORS.WHITE, margin: 7, alignItems: 'center',

        flexDirection: 'row',
        marginTop: 10,
        // borderColor: COLORS.WHITE,
        // shadowColor: COLORS.GRAY,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 1,
        // zIndex: 2,
        // borderColor: COLORS.GRAY,
        alignSelf: 'center',
        // justifyContent: 'space-between',
        width: '100%',
        // padding: 5,
        borderWidth: 0.5
    },
    profilepic: {
        width: 55,
        height: 55,
        backgroundColor: COLORS.GRAY,
        borderRadius: 50
    }
});
