import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import {COLORS, HEIGHT, WIDTH,FONT} from '../../Utils/constants';
import {getToken, getUserId, getUserType} from '../../Utils/Preference';
import Spinner from 'react-native-loading-spinner-overlay';
import Network from '../../Services/Network';
import YoutubePlayer from 'react-native-youtube-iframe';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Videos(props) {
  const [userType, setUserType] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [Loading, setLoading] = useState('');
  const [playing, setPlaying] = useState(false);
  const [message,setMessage]=useState('');
  const [invalid,setInvalid]=useState(false);
  const [page,setPage]=useState(1);
  const [limit,setLimit]=useState(20);
  const [isNext,setIsNext]=useState(false)

  useEffect(function () {
    token();
   
      getVideoList();
    
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
    } catch (e) {}
  };

  const returnVideoList = (item, index) => {

    console.log('hhh',item.videoLink.substring(17))
    return (
      <View style={{
        backgroundColor: COLORS.WHITE, margin: 7, alignItems: 'center',
        // borderColor: COLORS.WHITE,
        shadowColor: COLORS.GRAY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        zIndex: 2,
        borderColor: COLORS.GRAY,
        alignSelf: 'center',
      }}>
        <View style={{ backgroundColor: 'black' ,margin:5 }}>
          <YoutubePlayer
            height={200}
            width={windowWidth*0.95 }
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
            initialPlayerParams={{
              preventFullScreen:false
            }}
          />
          <View style={{ backgroundColor: COLORS.WHITE, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ padding: 10, width: windowWidth * 0.34 }}>{item.title}</Text>
          </View>
        </View>
      </View>
    )
  }




  const getVideoList = async () => {

    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    Network(`/get-trainer-videos-list?user_id=${id}`, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setLoading(false)
        if(response.response_code===2000){
          // setLimit(limit+20);
          // setPage(page+1);
              await setVideoList([...videoList,...response.response_data]);
       
        setInvalid(false)
        setMessage('')

        if(response.response_data.length===0){
          setInvalid(true)
          setMessage('Video not added by trainer')
        }
        }else{
          setInvalid(true)
          setLoading(false)
          setMessage(response.response_message)
        } 


        console.log('list', videoList)

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const  LoadMoreRandomData = () =>{
  
    getVideoList()
      }

  return (
    <SafeAreaView
      style={{
        flex: 1,
     
        backgroundColor: COLORS.WHITE,

      }}>
     
     {invalid &&
           <Text style={{textAlign:'center',
                  color:COLORS.RED,
                  fontFamily:FONT.FAMILY.REGULAR,
                  margin:10}}>
                    {message}
                    </Text>}
    
      <View style={{ marginBottom: 10 }}>
        <FlatList
          data={videoList}
          keyExtractor={(item, index) => index.toString()}
          // horizontal={false}
          // numColumns={2}
          // onEndReachedThreshold={0.5}
          // onEndReached={({ distanceFromEnd }) => {
          //   if (distanceFromEnd >= 0) {
          //     LoadMoreRandomData();
          //   }
          // }}
          // onEndReached={()=>
          //   LoadMoreRandomData()}
          renderItem={({ item, index }) => returnVideoList(item, index)} />
      </View>
      <Spinner
        visible={Loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />


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
