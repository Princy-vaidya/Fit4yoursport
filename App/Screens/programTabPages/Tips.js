import React, {useState,useEffect} from 'react';
import {View, Text, Image, Dimensions,FlatList,StyleSheet,} from 'react-native';
import {COLORS, HEIGHT, WIDTH,FONT} from '../../Utils/constants';
import {getUserId,getToken} from '../../Utils/Preference';
import moment from 'moment';

export default function Tips() {
  const[tips,setTips]=useState([])
  const [message,setMessage]=useState('');
  const [invalid,setInvalid]=useState(false);
  const [date,setDate]=useState(moment());
  const [loading,setLoading]=useState(false)

  useEffect(function () {
  
   
    getTipList();
    
  }, []);
  const getTipList = async () => {

    const id = await getUserId()
    const token = await getToken()
    setLoading(true)

    Network(`/get-todays-tip-by-trainer?user_id=${id}&date=${moment(date).format('YYYY-MM-DD')}`, 'get', '', token)
      .then(async function (response) {
        console.log('exerciselist', JSON.stringify(response));
        setLoading(false)
        if(response.response_code===2000){
        await setTips(response.response_data);
        setInvalid(false)
        setMessage('')
        if(response.response_data.length===0){
          setInvalid(true)
          setMessage('Tip not added by trainer')
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

  const returnTipList = (item, index) => {
    
  
    return (
     
         <View>
             <Text style={styles.listText}>
                   {index+1}. {item.tip} 
                </Text>
         </View>
    )
       
}
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{margin: 20, flexDirection: 'row'}}>
        {/* <Image
          source={require('../../Assets/Auths/agnewjohn.png')}
          style={{
            width: 80,
            height: 80,
            borderRadius: 100 / 2,
            overflow: 'hidden',
            borderWidth: 2,
          }}
        /> */}

{invalid ?
           <Text style={{textAlign:'center',
                  color:COLORS.RED,
                  fontFamily:FONT.FAMILY.REGULAR,
                  alignSelf:'center',
                  margin:10}}>
                    {message}
                    </Text>:
        <View style={styles.card}>
         <FlatList
          data={tips}
          keyExtractor={(item, index) => index.toString()}
        
          renderItem={({ item, index }) => returnTipList(item, index)} />
          </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
   
 listText:{
   fontSize:FONT.SIZE.SMALL,
   fontFamily:FONT.FAMILY.SEMI_BOLD,
   color:COLORS.BLACK,
   paddingTop:5
 },
 card:{
  width: '95%',
  //   height: 120,
    borderRadius: 6,
  //   elevation: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 20,
   alignSelf: 'center',
    backgroundColor:'white',
    borderWidth:2,
    borderColor:COLORS.LIGHTGRAY
 },
  
 });
 
 