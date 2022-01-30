import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, Image, SafeAreaView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { HEIGHT, GAP, COLORS, FONT } from '../../Utils/constants';
import { getToken, getUserId, setSessionKey } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import Header from '../../Utils/Header';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import Dialog from '../common/Dialog';
import Network from '../../Services/Network';
import moment from 'moment';



export default function Appoinment(props) {

    const [date, setDate] = useState(new Date());
    const [dob, setDOB] = useState(moment());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [slotList, setSlotList] = useState([]);
    const [type, setType] = useState([{ name: 'CHAT' }, { name: 'VIDEO' }]);
    const [isActivitiesDialog, setIsActivitiesDialog] = useState(false);
    const [message, setMessage] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [activityName, setActivityName] = useState({
        name: 'Select Type',
    });

    useEffect(function () {
        token();
    }, []);

    const token = async () => {
        try {
            const token = await getToken();
            const id = props.route.params.trainerId;

            getTrainerSlot(token, id)

        } catch (e) { }
    };


    const getTrainerSlot = (token, id) => {
        setLoading(true)

        Network(`/list-trainer-slot?trainer_id=${id}`, 'get', '', token)
            .then((response) => {
                setLoading(false)


                if (response.response_data.length != 0) {
                    setInvalid(false);
                    setMessage('');
                    setSlotList(response.response_data);

                } else {
                    setInvalid(true);
                    setMessage('Your trainer not added slot yet.');
                }

            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
    };


    const onUpdateTime = async (Id) => {
        const token = await getToken();
        const id = await getUserId();


        setLoading(true);
        let formdata = new FormData();

        formdata.append('slot_id', Id)
        formdata.append('trainer_id', props.route.params.trainerId)
        formdata.append('date', moment(dob).format('YYYY-MM-DD'))
        formdata.append('_id', props.route.params.editId)
        formdata.append('user_id', id)
        console.log('jkj', formdata)

        setLoading(true)
        Network('/add-edit-appointment', 'POST', formdata, token)
            .then(async (res) => {
                setLoading(false)
                if (res.response_code == 2000) {
                    Toast.show(res.response_message);
                    props.navigation.navigate('MyAppoinment')

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

    }



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDOB(currentDate);
    };


    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };


    const showDatepicker = () => {
        showMode('date');
    };


    const onSelectAppoinment = async (Id) => {

        if (props.route.params.subType !== 'CHAT' && props.route.params.subType !== 'VIDEO' && activityName.name === 'Select Type') {

            Toast.show('Please select appointment type.');

        } else {
            const token = await getToken();
            const trainerId = props.route.params.trainerId;
            const userId = await getUserId();
            let formdata = new FormData();
            formdata.append('trainer_id', trainerId)
            formdata.append('user_id', userId)
            formdata.append('slot_id', Id)
            formdata.append('date', moment(dob).format('YYYY-MM-DD'))
            formdata.append('appointment_type', (props.route.params.subType !== 'CHAT' && props.route.params.subType !== 'VIDEO') ? activityName.name : props.route.params.subType)

            console.log('ff', formdata)
            setLoading(true)
            Network('/add-edit-appointment', 'POST', formdata, token)
                .then(async (res) => {

                    console.log('jjj', res)
                    setLoading(false)
                    if (res.response_code == 2000) {
                        Toast.show(res.response_message);
                        props.navigation.navigate('MyAppoinment')
                    }
                    else {
                        Toast.show(res.response_message);
                    }

                })
                .catch((err) => {
                    console.log('Error --' + JSON.stringify(err));
                    Toast.show(res.response_message);
                });
        }
    }


    const returnSlotList = (item, index) => {
        return (
            <TouchableOpacity style={styles.slotView}
            >

                <View style={{ width: '60%', flexDirection: 'row' }}>
                    <View style={{ borderRightWidth: 0.5 }}>
                        <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>Slot {index + 1}</Text>
                    </View>
                    <Text style={{ padding: 10, fontSize: FONT.SIZE.MEDIUM }}>{item.start_time} - {item.end_time}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: COLORS.PRIMARY,
                        padding: 5, width: '25%',
                        borderRadius: 5
                    }}
                    onPress={() => props.route.params.editId ? onUpdateTime(item._id) : onSelectAppoinment(item._id)}>
                    <Text style={styles.textSmall}>Select</Text>
                </TouchableOpacity>

            </TouchableOpacity>

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
                title='Appointment'
                type='back'
            />

            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Loader loading={loading} />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '40%',
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
                                    moment(dob).format('YYYY-MM-DD')
                                }
                                style={{ color: COLORS.BLACK }}
                            />

                            <Image
                                resizeMode="contain"
                                source={require('../../Assets/Auths/calendar.png')}
                                style={{ width: 30, height: 30, tintColor: COLORS.RED }}
                            />

                        </View>


                    </TouchableOpacity>

                    <Dialog
                        isVisible={isActivitiesDialog}
                        title=" Type"
                        onValueSelected={(value) => {
                            setActivityName(value);
                            setIsActivitiesDialog(value);
                        }}
                        activityList={type}
                        onCancel={() => setIsActivitiesDialog(false)}
                    />
                    {(props.route.params.subType !== 'CHAT' && props.route.params.subType !== 'VIDEO') &&
                        <TouchableOpacity
                            style={{
                                width: '40%',
                            }}
                            activeOpacity={1}
                            onPress={() => setIsActivitiesDialog(true)}
                        >
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
                                    placeholder="Select Type"
                                    value={activityName.name}
                                    onChange={(value) => setActivityName(value)}

                                    // onBlur={() => setFieldTouched('email')}
                                    max={50}
                                    style={{ color: COLORS.BLACK }}

                                />

                                <Image
                                    resizeMode="contain"
                                    source={require('../../Assets/Auths/down-arrow.png')}
                                    style={styles.icon}
                                />
                            </View>
                        </TouchableOpacity>}
                </View>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                        style={{ width: 320, height: 100, borderWidth: 0.4, backgroundColor: "white" }}

                    />
                )}
                <View style={{ borderWidth: 1, margin: 10, height: '80%' }}>
                    <View style={{ backgroundColor: COLORS.PRIMARY }}>
                        <Text style={[styles.textSmall, { padding: 7 }]}>Select your  appointment time from the below list.</Text>
                    </View>

                    {invalid &&
                        <Text style={{
                            textAlign: 'center',
                            color: COLORS.RED,
                            fontFamily: FONT.FAMILY.REGULAR,
                            margin: 10
                        }}>
                            {message}
                        </Text>}

                    <FlatList
                        data={slotList}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        renderItem={({ item, index }) => returnSlotList(item, index)} />

                </View>
            </View>


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
        marginBottom: 20,

    },
    addImage: {
        alignSelf: 'flex-end',
        margin: 20,
        width: 58,
        height: 58
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
    slotView: {
        backgroundColor: COLORS.WHITE, margin: 7, alignItems: 'center',

        flexDirection: 'row',
        // borderColor: COLORS.WHITE,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        zIndex: 2,
        borderColor: COLORS.GRAY,
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '90%',
        padding: 5,
        borderWidth: 0.5,
        marginTop: 20
    },

});
