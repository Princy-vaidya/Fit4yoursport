import React, {useState,useEffect} from 'react';
import {View, Text, Image, FlatList,TouchableOpacity} from 'react-native';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import {getToken,getUserId} from '../../Utils/Preference';
import Network from '../../Services/Network';
import Loader from '../../Components/Common/Loader';
import moment from 'moment';

export default function CustomizedProgram(props) {
  const data = [
    {id: '1', Button: '1'},
    {id: '2', Button: '2'},
    {id: '3', Button: '3'},
  ];

  const [trainerList,setTrainerList]=useState([]);
  const [invalid,setInvalid]=useState(false);
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false)


  useEffect(function () {
    getPackageList()
   }, []);
 

  const  getPackageList = async () => {

    const token = await getToken()
    setLoading(true)
     Network('/list-all-trainer?page=1&limit=10&user_type=trainer', 'get', '', token)
      .then(async function (data) {
       
       if(data.response_code===2000){
         if(data.response_data.docs.length!=0){
        // alert(JSON.stringify(data.response_data.docs))
        setLoading(false)
         setTrainerList(data.response_data.docs)
       
         setInvalid(false);
         setMessage('')
         }else{
          setInvalid(true);
          setLoading(false);
          setMessage('Customized package not found.')
         }
       }
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const returnChatList = (item, index) => {
    console.log('image',item.profile_image)
    return(
      <View
            style={{
              width: '90%',
              height: 120,
              borderRadius: 6,
              elevation: 1,
              marginHorizontal: 20,
              marginVertical: 10,
              padding: 10,
              justifyContent: 'center',
              backgroundColor:'white',
              borderWidth:2,
              borderColor:COLORS.LIGHTGRAY
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginEnd: 10,
              }}>
                <View style={{flexDirection:'row',width:'70%'}}>
              <Image
                source={(item.profile_image===''||item.profile_image==null)
                ?
                require('../../Assets/Auths/user.png') :
               {uri:'https://fit4yoursport.dk:1446/'+item.profile_image}}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100 / 2,
                  overflow: 'hidden',
                  backgroundColor:COLORS.GRAY
                  // borderWidth: 2,
                }}
              />
              <View style={{marginLeft:15}}>
                <Text
                  style={{
                    color: COLORS.GRAY,
                  }}>
                 {item.fname + " " +item.lname}
                </Text>
                <Text
                  style={{
                    color: COLORS.GRAY,
                    marginTop: 10,
                  }}>
                  {item.dob===null?'NA':moment(item.dob).format('YYYY-MM-DD')}
                </Text>
                <Text
                  style={{
                    color: COLORS.GRAY,
                    marginTop: 10,
                  }}>
                  {item.height && item.height.height} {item.height && item.height.type}   {item.weight && item.weight.weight}  {item.weight && item.weight.type}
                  
                </Text>
              </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.RED,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  marginVertical: GAP.SMALL + 10,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Detail',{trainerDetail:item});
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: FONT.SIZE.SMALL,
                      color: COLORS.WHITE,
                      fontFamily: FONT.FAMILY.REGULAR,
                      fontWeight: 'bold',
                    }}>
                  Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
    )
  }

  return (
    <View style={{flex: 1,backgroundColor:'white'}}>
        <Loader loading={loading} />
      {!invalid?<FlatList
        style={{marginTop: 20}}
        data={trainerList}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => returnChatList(item, index)}
      />:
       <Text style={{
              textAlign: 'center',
              color: COLORS.RED,
              fontFamily: FONT.FAMILY.REGULAR,
              margin: 10
            }}>
              {message}
              </Text>}
    </View>
  );
}
