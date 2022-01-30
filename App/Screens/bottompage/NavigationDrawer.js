import React, { useState, useEffect, useContext,Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Share
} from 'react-native';
import Header from '../../Utils/Header';
import { COLORS, HEIGHT, WIDTH } from '../../Utils/constants';
import {
  setSessionKey,
  getUserProfileImage,
  setUserName,


} from '../../Utils/Preference';
import AsyncStorage from '@react-native-community/async-storage';
import { getToken, getUserId, getUserType, getUserName } from '../../Utils/Preference';
import Loader from '../../Components/Common/Loader';
import { AuthContext } from '../../contexts/AuthContext';
import Network from '../../Services/Network';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
// import FastImage from 'react-native-fast-image'



const NavigationDrawer = (props) => {
  const [userImage, setUserImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [enable, setEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [tokenId, setToken] = useState('')





  useEffect(
    () => {

      console.log('profileimage useeffect', props.userDetails.profileImage)

      if (props.userDetails.profileImage === " ") {
        setEnable(!enable)
        token();

      } else {

        // setTimeout(() => { setEnable(!enable)}, 100)
        console.log('imgValu', props.userDetails.profileImage)
        getUrl()
      }
    },
    [getUrl],
  );


  





  const getUrl = async () => {
    // setEnable(!enable)

    setUserImage(props.userDetails.profileImage)
    const name = await getUserName();
    setFirstName(name)
    const userType = await getUserType();
    setUserType(userType)

    console.log('imgUrl', userImage)
  }




  const logOutConfirmation = () => {
    Alert.alert(
      'Exit App',
      'Do you want to Logout?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => logout() },
      ],
    );
    return true;

  }

  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      const image = await getUserProfileImage();
      const name = await getUserName();
      const userType = await getUserType();


      setUserType(userType)
      setToken(token)
      setUserId(id)
      setFirstName(name)
      console.log('print url', props.userDetails.profileImage)
      //  if(props.userDetails.profileImage===" "){
      getProfileData(token, id);


      //  }

    } catch (e) { }
  };

  const getProfileData = (token, id) => {
    Network('/view-profile?_id=' + id, 'get', '', token)
      .then(function (response) {
        setLoading(false)
        const data = response.response_data;
        console.log('profile', JSON.stringify(response));
        setUserImage(data.profile_image);
        setFirstName(data.fname);
        setLastName(data.lname);
      })
      .catch(function (error) {
        console.log('err', JSON.stringify(error));
      });
  };



  var selectedItemPosition = 1;
  return (
    
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.BLACK,
        // width: Dimensions.get('window').width - 100,
      }}>
      <Loader loading={loading} />
      <ScrollView>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <View style={{ flexDirection: 'row' }}>

            <View style={{ flex: 1, alignItems: 'center' }}>


              < Image
                source={{ uri: userImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100 / 2,
                  // overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: 'white'
                }}
              />


              <Text style={{ color: COLORS.WHITE, fontSize: 18, marginTop: 10 }}>
                {firstName} {lastName}
              </Text>
            </View>

          </View>
        </View>

        {userType === 'user' &&

          <TouchableOpacity
            activeOpacity={1}
            style={{ paddingVertical: 6 }}
            activeOpacity={1}
            onPress={() => props.navigation.navigate('ContactTrainer')}>
            <View
              style={
                selectedItemPosition == 1
                  ? styles.headerViewInActive
                  : styles.headerViewInActive
              }>
              <Text
                style={{
                  color: COLORS.WHITE,
                  fontSize: 18,
                  marginTop: 30,
                  marginStart: 30,
                }}>
                My Subscription Plan
            </Text>
            </View>
          </TouchableOpacity>}
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />
        <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
          onPress={() => props.navigation.navigate('InviteGuest')}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            Invite Guest User
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />

        {userType === 'user' &&

          <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
            onPress={() => props.navigation.navigate('MyAppoinment')}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: 18,
                marginTop: 10,
                marginStart: 30,
              }}>
              My Appoinment
          </Text>
          </TouchableOpacity>
        }

        {userType === 'trainer' &&
          <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
            onPress={() => props.navigation.navigate('MySlot')}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: 18,
                marginTop: 10,
                marginStart: 30,
              }}>
              My Slot
          </Text>
          </TouchableOpacity>
        }
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />

        <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 8 }}
          onPress={() => props.navigation.navigate('PaymentHistory')}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            My Payment History
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />
        <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
          onPress={() => {
            // props.visibility();
            // props.setSelectedValue(3);
            userType === 'user' ? props.navigation.navigate('Program') : props.navigation.navigate('Video')
          }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            My Workout Program
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />
        {/* <TouchableOpacity activeOpacity={1} 
        style={{paddingVertical: 6}}
        onPress={() => {
          // props.visibility();
          // props.setSelectedValue(4);
          props.navigation.navigate('MyGoal')
        }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            My Goal
          </Text>
          <View />
        </TouchableOpacity> */}
        {/* <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        /> */}
        <TouchableOpacity
          activeOpacity={1}
          style={{ paddingVertical: 6 }}
          onPress={() => {
            // props.visibility();
            // props.setSelectedValue(5);
            props.navigation.navigate('Food')
          }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            Food
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />

        <TouchableOpacity
          activeOpacity={1}
          style={{ paddingVertical: 6 }}
          onPress={() => {
            // props.visibility();
            // props.setSelectedValue(6);
            props.navigation.navigate('Profile')
          }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            Profile
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />

        <TouchableOpacity
          style={{ paddingVertical: 6 }}
          onPress={() => {
            //   // props.visibility();
            //  AsyncStorage.clear()
            //   props.navigation.navigate('AuthStackScreen');
            logOutConfirmation()
          }}>
          <Text
            style={{
              color: COLORS.WHITE,
              fontSize: 18,
              marginTop: 10,
              marginStart: 30,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#949494',
            width: '100%',
            height: 0.5,
            marginTop: 8,
          }}
        />
      </ScrollView>
    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  headerViewInActive: {
    backgroundColor: 'black',
    paddingVertical: 6,
  },

  headerViewActive: {
    backgroundColor: 'red',
    paddingVertical: 6,
  },
});

const mapStateToProps = (state) => {
  return {
    userDetails: state.profileReducer.userDetails
  }
}
export default connect(mapStateToProps, null)(NavigationDrawer);

//  class NavigationDrawer extends Component {
  

//   constructor(props) {
// 		super(props);
// 		this.state = {
// 			userImage: '',
// 			firstName: '',
// 			lastName: '',
			
// 		}

// 	}

//    componentDidMount() {
//     if (this.props.userDetails.profileImage === " ") {
//               this.token();
      
//             } else {
//                 console.log('imgValu', this.props.userDetails.profileImage)
//               this.getUrl()
//             }
//   }


  

//   componentDidUpdate(prevProps){
//     if(prevProps.userDetails.profileImage !== this.props.userDetails.profileImage){
     
//       this.setState({
//         userImage:this.props.userDetails.profileImage
//       })
//       this.forceUpdate()
//       console.log('update ppp',this.props.userDetails.profileImage)
//     }
//   }

//    getUrl = async () => {
//         // setEnable(!enable)
    
//         // setUserImage(this.props.userDetails.profileImage)
//         const name = await getUserName();
//         // setFirstName(name)
//         const userType = await getUserType();
//         // setUserType(userType)
//      this.setState({
//        userImage:this.props.userDetails.profileImage,
//        firstName:name,
//        userType:userType
//      })
//         console.log('imgUrl', userImage)
//       }
    
    
    
    

//   token = async () => {
//         try {
//           const token = await getToken();
//           const id = await getUserId();
//           const image = await getUserProfileImage();
//           const name = await getUserName();
//           const userType = await getUserType();
    
//     this.setState({
//       userType:userType,
//       token:token,
//       firstName:name
//     })
//           // setUserType(userType)
//           // setToken(token)
//           // setUserId(id)
//           // setFirstName(name)
//           console.log('print url', this.props.userDetails.profileImage)
//           //  if(props.userDetails.profileImage===" "){
//           getProfileData(token, id);
    
//         } catch (e) { }
//       };


//     getProfileData = (token, id) => {
//     Network('/view-profile?_id=' + id, 'get', '', token)
//       .then(function (response) {
//         setLoading(false)
//         const data = response.response_data;
//         console.log('profile', JSON.stringify(response));
//         this.setState({
//           userImage:data.profile_image,
//           firstName:data.fname,
//           lastName:data.lname
//         })
//         // setUserImage(data.profile_image);
//         // setFirstName(data.fname);
//         // setLastName(data.lname);
//       })
//       .catch(function (error) {
//         console.log('err', JSON.stringify(error));
//       });
//   };

    
//   render() {
//     const {
//       userImage,
//       firstName,
//       lastName
//     } = this.state;


    
    
//     return (
//       <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: COLORS.BLACK,
//         // width: Dimensions.get('window').width - 100,
//       }}>
//       {/* <Loader loading={loading} /> */}
//       <ScrollView>
//         <View style={{ alignItems: 'center', marginTop: 20 }}>
//           <View style={{ flexDirection: 'row' }}>

//             <View style={{ flex: 1, alignItems: 'center' }}>


//               < Image
//                 source={{ uri: userImage }}
//                 style={{
//                   width: 100,
//                   height: 100,
//                   borderRadius: 100 / 2,
//                   // overflow: 'hidden',
//                   borderWidth: 2,
//                   borderColor: 'white'
//                 }}
//               />


//               <Text style={{ color: COLORS.WHITE, fontSize: 18, marginTop: 10 }}>
//                 {firstName} {lastName}
//               </Text>
//             </View>

//           </View>
//         </View>

//         {/* {userType === 'user' &&

//           <TouchableOpacity
//             activeOpacity={1}
//             style={{ paddingVertical: 6 }}
//             activeOpacity={1}
//             onPress={() => props.navigation.navigate('ContactTrainer')}>
//             <View
//               style={
//                 selectedItemPosition == 1
//                   ? styles.headerViewInActive
//                   : styles.headerViewInActive
//               }>
//               <Text
//                 style={{
//                   color: COLORS.WHITE,
//                   fontSize: 18,
//                   marginTop: 30,
//                   marginStart: 30,
//                 }}>
//                 My Subscription Plan
//             </Text>
//             </View>
//           </TouchableOpacity>} */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}
//         {/* <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
//           onPress={() => props.navigation.navigate('InviteGuest')}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             Invite Guest User
//           </Text>
//         </TouchableOpacity> */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}

//         {/* {userType === 'user' &&

//           <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
//             onPress={() => props.navigation.navigate('MyAppoinment')}>
//             <Text
//               style={{
//                 color: COLORS.WHITE,
//                 fontSize: 18,
//                 marginTop: 10,
//                 marginStart: 30,
//               }}>
//               My Appoinment
//           </Text>
//           </TouchableOpacity>
//         } */}

//         {/* {userType === 'trainer' &&
//           <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
//             onPress={() => props.navigation.navigate('MySlot')}>
//             <Text
//               style={{
//                 color: COLORS.WHITE,
//                 fontSize: 18,
//                 marginTop: 10,
//                 marginStart: 30,
//               }}>
//               My Slot
//           </Text>
//           </TouchableOpacity>
//         } */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}

//         {/* <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 8 }}
//           onPress={() => props.navigation.navigate('PaymentHistory')}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             My Payment History
//           </Text>
//         </TouchableOpacity> */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}
//         {/* <TouchableOpacity activeOpacity={1} style={{ paddingVertical: 6 }}
//           onPress={() => {
//             // props.visibility();
//             // props.setSelectedValue(3);
//             userType === 'user' ? props.navigation.navigate('Program') : props.navigation.navigate('Video')
//           }}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             My Workout Program
//           </Text>
//         </TouchableOpacity> */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}
//         {/* <TouchableOpacity activeOpacity={1} 
//         style={{paddingVertical: 6}}
//         onPress={() => {
//           // props.visibility();
//           // props.setSelectedValue(4);
//           props.navigation.navigate('MyGoal')
//         }}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             My Goal
//           </Text>
//           <View />
//         </TouchableOpacity> */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}
//         {/* <TouchableOpacity
//           activeOpacity={1}
//           style={{ paddingVertical: 6 }}
//           onPress={() => {
//             // props.visibility();
//             // props.setSelectedValue(5);
//             props.navigation.navigate('Food')
//           }}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             Food
//           </Text>
//         </TouchableOpacity> */}
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}

//         <TouchableOpacity
//           activeOpacity={1}
//           style={{ paddingVertical: 6 }}
//           onPress={() => {
//             // props.visibility();
//             // props.setSelectedValue(6);
//             this.props.navigation.navigate('Profile')
//           }}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             Profile
//           </Text>
//         </TouchableOpacity>
//         {/* <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         /> */}

//         {/* <TouchableOpacity
//           style={{ paddingVertical: 6 }}
//           onPress={() => {
//             //   // props.visibility();
//             //  AsyncStorage.clear()
//             //   props.navigation.navigate('AuthStackScreen');
//             logOutConfirmation()
//           }}>
//           <Text
//             style={{
//               color: COLORS.WHITE,
//               fontSize: 18,
//               marginTop: 10,
//               marginStart: 30,
//             }}>
//             Logout
//           </Text>
//         </TouchableOpacity> */}
//         <View
//           style={{
//             backgroundColor: '#949494',
//             width: '100%',
//             height: 0.5,
//             marginTop: 8,
//           }}
//         />
//       </ScrollView>
//     </SafeAreaView>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     userDetails: state.profileReducer.userDetails
//   }
// }
// export default connect(mapStateToProps, null)(NavigationDrawer);