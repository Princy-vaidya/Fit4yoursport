import React, {useState,useEffect} from 'react';
import {View, Text, Dimensions, FlatList,TouchableOpacity} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH, GAP, FONT} from '../../Utils/constants';
import Button from '../../Components/Common/Button';
import stripe from 'tipsi-stripe';
import  CardFormScreen from '../../scenes/CardFormScreen';
import Network from '../../Services/Network';
import {getToken,getUserId} from '../../Utils/Preference';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../Components/Common/Loader';


stripe.setOptions({
  publishableKey:"pk_live_51JHOONL50adRyLAuleuOmKaDSjOqvHSYNXIRb31J4Yc99dxdHlN2TXOA6u9b0DZLHGE5IzqIY0aJ4NW91crx52pP00X52IzgIa",
})

export default function StandardProgram(props) {
  const {navigation} = props;
  const [pay,setPay]=useState(false)
  const [data,setData]=useState([]);
  const [message,setMessage]=useState('');
  const [invalid,setInvalid]=useState(false);
  const [loading,setLoading]=useState(false);
  const [packageData,setpackageData]=useState([]);




   useFocusEffect(
    React.useCallback(() => {
      getPackageList();
      getSubscribeTrainer()
    }, []),
  );
 

  const  getPackageList = async () => {

    const token = await getToken()
    setLoading(true)
     Network('/list-standard-program-cat?page=1&limit=30', 'get', '', token)
      .then(async function (data) {
    console.log('payment',data)
       
       if(data.response_code===2000){
         if(data.response_data.docs.length!=0){
       
        setLoading(false)
        setData(data.response_data.docs)
     
         setInvalid(false);
         setMessage('')
         }else{
          setInvalid(true);
          setLoading(false);
          setMessage('Standard package not found.')
         }
       }
        })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };


  const getSubscribeTrainer = async () => {

    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    console.log(id)
    Network(`/my-subscribed-trainer?` + `user_id=${id}`, 'get', '', token)
      .then(async function (response) {
        console.log('trainerlist', JSON.stringify(response));
        setLoading(false)
        if (response.response_data.docs.length != 0) {
         const packageId=response.response_data.docs.filter((item)=>
         item.package_id!=null)


         setpackageData(packageId)
        }

        })
      }


  const returnTrainerList = (item, index) => {

   const packageId =  packageData.filter((value)=> value.package_id === item._id);

   console.log('id...',packageId)
   // console.log('vaue',packageId[0].package_id)
  // alert(item._id === packageId[0].package_id)
    return (

     
     
      <TouchableOpacity
            style={{
              width: '90%',
              height: 120,
              borderRadius: 6,
              elevation: 1,
              marginHorizontal: 20,
              marginVertical: 10,
              padding: 20,
              justifyContent: 'center',
              backgroundColor:'white',
              borderWidth:2,
              borderColor:COLORS.LIGHTGRAY
            }}
            // onPress={()=>props.navigation.navigate('CardFormScreen',{packageId:item._id})}
            >
              
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    color: COLORS.GRAY,
                  }}>
                  Monthly
                </Text>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.BLACK,
                      fontSize: 18,
                    }}>
                  {item.package_price}$
                  </Text>
                  /month
                </Text>
                <Text
                  style={{
                    color: COLORS.GRAY,
                    marginTop: 10,
                  }}>
                  Customer care support
                </Text>
              </View>
                {( packageId.length==0 )  &&
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('CardFormScreen',{packageId:item._id})
                    }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.RED,
                    borderRadius: 20,
                    marginVertical: GAP.SMALL + 10, 
                    borderColor: COLORS.RED,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: FONT.SIZE.SMALL,
                      color: COLORS.WHITE,
                      fontFamily: FONT.FAMILY.REGULAR,
                      fontWeight: 'bold',
                    }}>
                    Subscribe
                  </Text>
                </View>
              </TouchableOpacity>} 
             
            
            </View>
          </TouchableOpacity>
          )
}

  return (
    <View style={{flex: 1,backgroundColor:'white'}}>
    <Loader loading={loading}/>
    {invalid && <Text style={{color:COLORS.RED,textAlign:'center',  fontFamily:FONT.FAMILY.REGULAR,
                  margin:10}}>{message}</Text>}
      <FlatList
        style={{marginTop: 20}}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => (
          returnTrainerList(item, index)
        )}
      />
    </View>
  );
}
