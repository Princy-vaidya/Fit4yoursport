import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, Image, Dimensions, TextInput, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, HEIGHT, WIDTH, FONT } from '../../Utils/constants';
import Button from '../../Components/Common/Button';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import { getToken, getUserId, getUserType } from '../../Utils/Preference';
import Moment from 'moment';
import Loader from '../../Components/Common/Loader';



export default function TrainerTips(props) {

  const [writeTip, setWriteTip] = useState('');
  const [TipList, setTipList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef()

  useEffect(function () {
    token();
    getTipList()

  }, []);


  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      const type = await getUserType();
      setUserType(type);
      getExerciseList(token);
      setAuthToken(token);
      setUserId(id);

    } catch (e) { }
  };

  const getTipList = async () => {
    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    Network(`/list-tip?trainer_id=${props.trainerId}&date=${Moment().format('YYYY-MM-DD')}&user_id=${props.userDetailsId}`, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setLoading(false)

        if( response.response_data.docs.length!=0){
          setInvalid(false)
          setMessage('')
        let newTipList = []
        response.response_data.docs.map(item => {
          newTipList.push({
            tip: item.tip,
            id: item._id,
            setTipEdit: false
          })
        })
         setTipList(newTipList);
        console.log('list', TipList)
      }else{
        setInvalid(true)
        setMessage('Tips not found.')
        }

      })
      .catch(function (error) {
        alert(error)
        console.log(JSON.stringify(error));
      });
  }


  const onAddTips = async () => {
    if (writeTip === '') {
      Toast.show('To add tip,please write a tip.');
    }
    else {
      setLoading(true);
      const token = await getToken()
      const requestBody = {
        trainer_id: props.trainerId,
        user_id: props.userDetailsId,
        tip: writeTip
      };
      console.log('req', requestBody)
      Network('/trainer-add-tip', 'post', requestBody, token)
        .then((res) => {
          setLoading(false);
          if (res.response_code === 2000) {
            Toast.show(res.response_message);
            setLoading(true);
            getTipList()
            setLoading(false);

          } else if (res.response_code === 5010) {

            Toast.show(res.response_message);
          } else {
            Toast.show(res.response_message);
          }
        })

        .catch((error) => {
          setLoading(false);
          Toast.show(res.response_message);
        });
    }
    setWriteTip('')
  }

  const onUpdateTips = async (index) => {
    const token = await getToken()
    const requestBody = {
      _id: TipList[index].id,
      trainer_id: props.trainerId,
      tip: TipList[index].tip
    };
    console.log('req', requestBody)
    Network('/trainer-edit-tip', 'post', requestBody, token)
      .then((res) => {
        setLoading(false);
        if (res.response_code === 2000) {
          Toast.show(res.response_message);
          getTipList()

        } else if (res.response_code === 5010) {

          Toast.show(res.response_message);
        } else {
          Toast.show(res.response_message);
        }
      })

      .catch((error) => {
        setLoading(false);
        Toast.show(res.response_message);
      });


  }

  const onTipEdit = (value, index) => {
    console.log('TipList', TipList)
    let TipEdit = [...TipList];
    TipEdit[index].tip = value;
    TipEdit[index].setTipEdit = true;
    setTipList(TipEdit)
    // console.log('jjj',Tip)
  }

  const onEditTip = (index) => {
    let TipEdit = [...TipList];
    console.log('id', TipEdit)
    TipEdit[index].setTipEdit = true;
    setTipList(TipEdit)

  }



  const returnVideoList = (item, index) => {
    return (
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15
      }}>

        <View style={item.setTipEdit ? styles.textInputContainerUpdate : styles.textInputContainer}>
          <Text style={{ color: COLORS.BLACK, fontFamily: FONT.FAMILY.SEMI_BOLD, marginLeft: 10,marginRight:5 }}>{index + 1}.</Text>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            blurOnSubmit={true}
            multiline={true}
            autoFocus={item.setTipEdit && true}
            // onFocus={item.setTipId}
            editable={item.setTipEdit && true}
             ref={inputRef}
            // keyboardAppearance="dark"
            keyboardType="default"
            mode="outlined"
            value={item.tip}
            onChangeText={(value) =>
              onTipEdit(value, index)
            }

          />
        </View>

        {!item.setTipEdit ?
          <TouchableOpacity style={{ alignSelf: 'center', width: '15%' }}
            onPress={() => onEditTip(index)}
          >
            <Image source={require('../../Assets/Home/edit.png')}
              style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
          : <TouchableOpacity style={styles.updateButton}
            onPress={() => onUpdateTips(index)}>
            <Text style={styles.updatedText}>Update</Text>
          </TouchableOpacity>}

      </View>
    )
  }





  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ margin: 20, flexDirection: 'row' }}>
      <Loader loading={loading} />

        <Image
          source={props.profile != null ?
            { uri: 'https://fit4yoursport.dk:1446/' + props.profile }
            : require('../../Assets/Auths/user.png')}
          style={{
            width: 60,
            height: 60,
            borderRadius: 100 / 2,
            overflow: 'hidden',
            borderWidth: 2,
            backgroundColor: COLORS.GRAY
          }}
        />
        <Text
          style={{
            color: COLORS.BLACK,
            fontSize: 18,
            paddingStart: 10,
            alignSelf: 'center',
          }}>

          {props.fname} {props.lname}
        </Text>
      </View>
      <View style={{ borderBottomWidth: 2, borderColor: COLORS.LIGHTGRAY, }}>
        <View style={[styles.textInputContainer, styles.typeView ]}>
          <TextInput
            style={[styles.textInput, { marginLeft: 10 }]}
            placeholder='Type here ...'
            placeholderTextColor="grey"
            autoCorrect={false}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            blurOnSubmit={true}
            multiline={true}
            // numberOfLines={5}
            value={writeTip}
            onChangeText={input => {
              setWriteTip(input);
            }}
            keyboardType="default"
            mode="outlined"

          />
        </View>

        <Button
          onPress={() => { onAddTips() }}
          type="white"
          title="ADD TIP"
        />
      </View>

      <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
        <Text style={styles.addText}>
          ADDED TIPS :-
                  </Text>
        <View style={{ marginTop: 10 }}>
      {!invalid ?
          <FlatList
            data={TipList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => returnVideoList(item, index)} />
            :
            <Text style={{color:COLORS.RED,fontFamily:FONT.FAMILY.SEMI_BOLD}}>
              {message}
              </Text>
      }
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    paddingTop: 10,
    width: '78%',
    // height: 70,
    borderRadius: 10,
    // marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.44,
    shadowRadius: 1.32,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    flexDirection: 'row',
  },
  textInputContainerUpdate: {
    paddingTop: 10,
    width: '78%',
    // height: 70,
    borderRadius: 10,
    // marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.44,
    shadowRadius: 1.32,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.RED,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    fontFamily: FONT.FAMILY.REGULAR,
    color: COLORS.BLACK,
    ...Platform.select({
      android:{
        marginTop: -10,
      },
      ios:{
        marginTop: -5,
      }

    }),
    //  textAlignVertical: "center",
   height:40
  },
  updateButton:{
    justifyContent: 'center',
   backgroundColor: COLORS.RED,
    width: '17%',
    margin: 5, 
    height: 30, 
    alignSelf: 'center', 
    borderRadius: 5
  },
  updatedText:{
    textAlign: 'center', 
    fontSize: FONT.SIZE.SMALL, 
    fontFamily: FONT.FAMILY.REGULAR, 
    color: COLORS.WHITE
  },
  addText:{
    fontSize: FONT.SIZE.MEDIUM, 
    fontFamily: FONT.FAMILY.SEMI_BOLD 
  },
  typeView:{
    alignSelf: 'center',
     marginBottom: -5,
      width: '90%',
      height:100 
  }

});
