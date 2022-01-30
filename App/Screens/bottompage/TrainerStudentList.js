import React, {useState,useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View,Image,TextInput} from 'react-native';
import AlphabetList from 'react-native-flatlist-alphabet';
import ContactCard from '../../Components/CardSwipe/ContactCard';
import {COLORS, FONT, HEIGHT, WIDTH} from '../../Utils/constants';
import Network from '../../Services/Network';
import { getToken, getUserId, getUserType } from '../../Utils/Preference';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from '../../Utils/Header'
import { set } from 'react-native-reanimated';

// import { next } from 'cli';


 export default function TrainerStudentList(props) {
     const {navigate} = props.navigation;
     const [studentList, setStudentList] = useState([])
     const [Loading,setLoading]=useState(false)
     const [message, setMessage] = useState('');
     const [invalid, setInvalid] = useState(false);
   
  
   const onItemPress=(item)=>{
       
     navigate('TrainerdetailTab',{
       fname:item.value,
       lname:item.lname,
       profile_image:item.profile_image,
       userDetailsId:item.id,
       trainerId:item.trainerId
     })
  }

  useEffect(function () {
    token();
      getStudentList()
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

  const getStudentList = async() => {
    
    const id=await getUserId()
    const token=await getToken()
    setLoading(true)

    Network(`/student-list?`+`trainer_id=${id}`, 'get', '', token)
      .then(async function (response) {
        setLoading(false)
        console.log('exerciselist', JSON.stringify(response));
        if( response.response_data.docs.length!=0){
        let newStudentList=[];
        
        response.response_data.docs.map(item => {
            let userDetails=item.userDetails
            newStudentList.push({
               profile_image:userDetails.profile_image,
               value:userDetails.fname,
               lname:userDetails.lname,
               id:userDetails._id,
               trainerId:item.trainer_id
            })})
     await setStudentList(newStudentList);
        console.log('list....',newStudentList)
        // alert(JSON.stringify(newStudentList))
          }else{
            setInvalid(true)
            setMessage('Tips not found.')
          }
        
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
      
  };

  
  const searchCards = inputString => {
    let currentData = [];
   if (inputString === "")
    {    setInvalid(false)
        getStudentList()
    } else
    {
      currentData = studentList.filter(x =>
        String(x.value.toLowerCase()).includes(
          inputString.toLowerCase()
        )
      );

      if( currentData.length ==0){
        setInvalid(true)
        setMessage('Students not found.')
      }

    setStudentList(currentData)
        }
  };


 const renderListItem = (item) => {
     
    return (
      <View style={styles.listItemContainer}>
        {/* <Text style={styles.listItemLabel}>{item.value}</Text> */}
        <ContactCard item={item} onItemPress={()=>onItemPress(item)} />

      </View>
    );
  };

 const  renderSectionHeader = (section) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  };


    return (
      <SafeAreaView style={styles.container}>

        <Header
          navigation={props.navigation}
          title='Student List'
          type='menu'
         
       />     
           <Spinner
      visible={Loading}
      textContent={'Loading...'}
      textStyle={{color:'#FFF'}}
      />
        
          
           <View style={styles.search}>
          
          <TextInput
            style={{ flex: 1, fontFamily: FONT.FAMILY.REGULAR,marginLeft:20 }}
            placeholder=''
            placeholderTextColor="grey"
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={input => {
              searchCards(input);
            }}
            autoCorrect={false}
            returnKeyType="search"
          />
          <Image
            source={require('../../Assets/Auths/search.png')}
            style={{ width: 20, height: 20, margin: 10 }}
          />
        </View>
      
          {!invalid ?
        <AlphabetList
          style={{flex: 1}}
          data={studentList}
          renderItem={renderListItem}
          renderSectionHeader={renderSectionHeader}
          getItemHeight={() => 0}
          sectionHeaderHeight={0}
          letterItemStyle={{ height: 30}}
          indexLetterColor={COLORS.BLACK}
        />:
        <Text style={{color:COLORS.RED,fontFamily:FONT.FAMILY.SEMI_BOLD,textAlign:'center'}}>
          {message}</Text>}
       
        
      </SafeAreaView>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // borderTopWidth:0.5
  },

  search: {
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth:0.5,
    margin: 20,
    borderColor:COLORS.GRAY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  listItemContainer: {
    flex: 1,
    height: 55,
    paddingHorizontal: 10,
    justifyContent: 'center',
    // borderTopColor: 'grey',
    // borderTopWidth: 1,
  },

  listItemLabel: {
    color:COLORS.BLACK,
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily:FONT.FAMILY.SEMI_BOLD
  },

  sectionHeaderContainer: {
    height: 30,
    // backgroundColor: 'red',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom:-5,
    marginTop:10
  },

  sectionHeaderLabel: {
    color: COLORS.BLACK,
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily:FONT.FAMILY.SEMI_BOLD
  },
});