import React, { useState, useEffect, useRef, } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet, TouchableOpacity, TextInput,
  ScrollView
} from 'react-native';
import { COLORS, FONT, HEIGHT, WIDTH } from '../../Utils/constants';
import { getToken, getUserId, getUserType } from '../../Utils/Preference';
import Modal from 'react-native-modal';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import YoutubePlayer from 'react-native-youtube-iframe';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../../Utils/Header'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Video(props) {
  const [userType, setUserType] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [videoName, setVideoName] = useState('');
  const [Loading, setLoading] = useState('');
  const [playing, setPlaying] = useState(false);
  const [videoList, setVideoList] = useState([])


  useEffect(function () {
    token();
    getVideoList()
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

  const getVideoList = async () => {

    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    Network(`/trainer-list-video?` + `trainer_id=${id}`, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setLoading(false)
        await setVideoList(response.response_data.docs);
        console.log('list', videoList)

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const onAddVideo = async () => {


    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
     var match = url.match(regExp);
    let urlNew=match && match[2].length == 11
    
    
    if (videoName == '') {
      Toast.show('Video name can not be empty.', Toast.LONG);
    }
    else if (url == '') {
      Toast.show('YouTube url can not be empty.', Toast.LONG);
    } else if (!urlNew) {
      Toast.show('YouTube url is invalid.', Toast.LONG)
    }else{
            // Do anything for being valid
            // if need to change the url to embed url then use below line
        setLoading(true);
      // const videoUrl=url.substring(32);
      const id = await getUserId()
      const token = await getToken()
      const requestBody = {
        trainer_id: id,
        title: videoName,
        videoLink: url
      };
      console.log('req', requestBody)
      Network('/trainer-add-video', 'post', requestBody, token)
        .then((res) => {
          setLoading(false);

          if (res.response_code === 2000) {
            Toast.show(res.response_message);
            getVideoList()
            setShowModal(false);
    setVideoName('');
    setUrl('');
          } else if (res.response_code === 5010) {

            Toast.show(res.response_message);
            setShowModal(false);
    setVideoName('');
    setUrl('')
          } else {
            Toast.show(res.response_message);
            setShowModal(false);
    setVideoName('');
    setUrl('')
          }
        })
      
        .catch((error) => {
          setLoading(false);
          Toast.show(res.response_message);
        });
    
  }
    
  }

  const onVideoDelete = async (id) => {
    const token = await getToken()
    const requestBody = {
      _id: id
    };
    console.log('req', requestBody)
    setLoading(true)
    Network('/delete-video', 'post', requestBody, token)
      .then((res) => {
        setLoading(false);

        if (res.response_code === 2000) {
          Toast.show(res.response_message);
          getVideoList()
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

  const returnVideoList = (item, index) => {
    return (
      <View style={{
        backgroundColor: COLORS.WHITE, margin: 7, alignItems: 'center',
        // borderColor: COLORS.WHITE,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 2,
        borderColor: COLORS.GRAY,
        alignSelf: 'center',
        margin:20
      }}>
        <View style={{ backgroundColor: 'black' ,margin:5 }}>
          <YoutubePlayer
            height={200}
            width={windowWidth * 0.95}
            videoId={item.videoLink.substring(17)}
            play={playing}
            onChangeState={event => console.log(event)}
            onReady={() => console.log("ready")}
            onError={e => console.log(e)}
            onPlaybackQualityChange={q => console.log(q)}
            volume={50}
            playbackRate={1}
            playerParams={{
              cc_lang_pref: "us",
              showClosedCaptions: true
            }}
          />
          <View style={{ backgroundColor: COLORS.WHITE, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ padding: 10, width: windowWidth * 0.34 }}>{item.title}</Text>
            <TouchableOpacity style={{ padding: 10 }}
              onPress={() => onVideoDelete(item._id)}>
              <Image source={require('../../Assets/Auths/delete.png')} style={{ width: 20, height: 20, width: windowWidth * 0.05 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }




  const onAddPress = () => {
    setShowModal(true)
  }

  // const videoList=[
  //   {id: 'KDoqpd8Mgww' },
  //   {id: 'KDoqpd8Mgww'},
  // ]

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // borderTopWidth: 0.5,
        backgroundColor: COLORS.WHITE,

      }}>
      <Header
        title='Video'
        type='menu'
        navigation={props.navigation}

      />

      <Modal transparent={true}
        visible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          alignSelf: 'center',
          margin: -10,
          backgroundColor: '#000000aa',
        }}>
        <View style={styles.modalView}>
          <View style={{ backgroundColor: COLORS.PRIMARY, borderTopStartRadius: 15, borderTopEndRadius: 15, padding: 3 }}>
            <Text style={styles.whiteText}>Add Video</Text>
          </View>
          <View style={styles.youTubeTextView}>
            <Text style={[styles.whiteText, styles.addVideoText]}>
              Video Name
                 </Text>
          </View>

          <TextInput
            style={styles.TextInputText}
            placeholder="Video Name"
            keyboardType='default'
            autoCapitalize='none'
            autoCorrect={false}
            value={videoName}
            returnKeyType='done'
            onChangeText={(value) => {
              setVideoName(value)
            }}
          />
          <View style={styles.youTubeTextView}>
            <Text style={[styles.whiteText, styles.addVideoText]}>
              Video(YouTube) URL link
              </Text>
          </View>

          <TextInput
            style={styles.TextInputText}
            placeholder="Video URL Link"
            keyboardType='default'
            autoCapitalize='none'
            autoCorrect={false}
            value={url}
            returnKeyType='done'
            onChangeText={(value) => {
              setUrl(value)
            }}
          />
          <TouchableOpacity style={styles.addTextView}
            onPress={onAddVideo}>
            <Text style={styles.whiteText}>Add</Text>
          </TouchableOpacity>
        </View>

      </Modal>
      <ScrollView style={{}}>
      <View style={{ marginBottom:60}}>
        <FlatList
          data={videoList}
          keyExtractor={(item, index) => index.toString()}
          // horizontal={false}
          // numColumns={2}
          renderItem={({ item, index }) => returnVideoList(item, index)} />
      </View>
      </ScrollView>
      <Spinner
        visible={Loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />

      <TouchableOpacity
        onPress={onAddPress}
        style={styles.addButton}>
        <Image source={require('../../Assets/Auths/ADD.png')}
          style={styles.addImage} />
      </TouchableOpacity>



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
    // marginBottom: 20,

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
    paddingTop:15,
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
  }
});
