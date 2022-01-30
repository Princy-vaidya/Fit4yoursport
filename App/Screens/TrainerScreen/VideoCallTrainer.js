import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { getUserId,getToken , getUserEmail} from '../../Utils/Preference';
import Network from '../../Services/Network'
import {useFocusEffect} from '@react-navigation/native';


function ReCallGroupList({getGroupsListAction = () => {}}) {
  useFocusEffect(
    React.useCallback(() => {
      getGroupsListAction();
    }, []),
  );

  return null;
}
export default class VideoCallTrainer extends Component {

  constructor(props) {
    super(props);
    this.state={
      profile:[]
    }
    this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
    this.onConferenceJoined = this.onConferenceJoined.bind(this);
    this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);
  }

  componentDidMount = async () => {
   
    this.getProfileData();
    const { navigation } = this.props;
   
    
  
  }



   getProfileData = async() => {
    const token = await getToken();
      const id = await getUserId();
     const email=await getUserEmail();
      const userId=this.props.route.params.userId;
    Network('/view-profile?_id=' + id, 'get', '', token)
      .then(function (response) {
        const data = response.response_data;
        console.log('okkk', data.profile_image)

    //  alert(JSON.stringify(data))
    
     setTimeout(() => {
        const url = `https://meet.jit.si/${userId}`; 
        const userInfo = 
        { displayName:data.fname, 
          email:email, 
         avatar: data.profile_image
        };
        JitsiMeet.call(url, userInfo);
        
      }, 1000);
    
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  componentWillUnmount = () => {
    JitsiMeet.endCall();
  }

  onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    JitsiMeet.endCall();
    this.props.navigation.goBack();

    console.log('onConferenceTerminated')
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log('onConferenceJoined')
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log('onConferenceWillJoin')
  }

  render() {
    return (
      // <View style={{ backgroundColor: 'black', flex: 1 }}>
    <>
      <ReCallGroupList
      getGroupsListAction={this.getProfileData}
    />
        <JitsiMeetView onConferenceTerminated={this.onConferenceTerminated} 
        onConferenceJoined={this.onConferenceJoined} 
        onConferenceWillJoin={this.onConferenceWillJoin} 
        style={{ flex: 1, height: '100%', width: '100%' }} />
      </>
    );
  }


};

