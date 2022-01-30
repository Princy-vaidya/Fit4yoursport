import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { COLORS, FONT, WIDTH } from './constants';
import { Image, SafeArea, StyleSheet, View, TouchableWithoutFeedback, Text, ScrollView ,SafeAreaView} from 'react-native';
import exercise from '../Screens/mygoalPages/Exercise';
import TrainerTips from '../Screens/homepage/TrainerTips';
import TrackExercise from '../Screens/mygoalPages/TrackExercise';
import AddExercise from '../Screens/mygoalPages/AddExercise';
import Exercise from '../Screens/mygoalPages/Exercise';
import Goal from '../Screens/mygoalPages/Gaol';
import Header from '../Utils/Header'

// const Tab = createMaterialTopTabNavigator();

// export default function TrainertipNavigation() {
//   return (
//     <Tab.Navigator
//       tabBarOptions={{
//         indicatorStyle: {
//           backgroundColor: 'red',
//           marginBottom: 10,
//         },
//         tabStyle: {width: WIDTH / 4},
//         labelStyle: {
//           fontSize: 10,
//           color: COLORS.GRAY,
//         },
//         style: {
//           backgroundColor: '#00000000',
//         },
//       }}>

//       <Tab.Screen
//         name="exercise"
//         component={exercise}
//         options={{
//           tabBarLabel: 'Exercise',
//           tabBarIcon: () => (
//             <Image
//               source={require('../Assets/Auths/home.png')}
//               style={{
//                 width: 20,
//                 height: 20,
//                 tintColor: COLORS.GRAY,
//                 resizeMode: 'contain',
//                 marginTop: 5,
//               }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="TrackExercise"
//         component={TrackExercise}
//         options={{
//           tabBarLabel: 'Track Exercise',
//           tabBarIcon: () => (
//             <Image
//               source={require('../Assets/Auths/shout.png')}
//               style={{
//                 width: 20,
//                 height: 20,
//                 tintColor: COLORS.GRAY,
//                 marginTop: 5,
//                 resizeMode: 'contain',
//               }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="AddExercise"
//         component={AddExercise}
//         options={{
//           tabBarLabel: 'Add Exercises',
//           tabBarIcon: () => (
//             <Image
//               source={require('../Assets/Auths/subscription.png')}
//               style={{
//                 width: 20,
//                 height: 20,
//                 marginTop: 5,
//                 tintColor: COLORS.GRAY,

//                 resizeMode: 'contain',
//               }}
//             />
//           ),
//         }}
//       />
//         <Tab.Screen
//         name="TrainerTips"
//         component={TrainerTips}
//         options={{
//           tabBarLabel: 'Tips',
//           tabBarIcon: () => (
//             <Image
//               source={require('../Assets/Auths/home.png')}
//               style={{
//                 width: 20,
//                 height: 20,
//                 tintColor: COLORS.GRAY,
//                 resizeMode: 'contain',
//                 marginTop: 5,
//               }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
export default class TrainertipNavigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    }
  }



  onTabChange = index => {
    this.setState({ activeTabIndex: index });
  };

  

  Tabchange = () => {
    return (
      <View style={styles.card}>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(0)}
        >
          <View style={this.state.activeTabIndex===0 ?
          {flex:0.7,borderBottomWidth:2,borderColor:COLORS.RED}
        :{flex:0.7}}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 0
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Exercise
            </Text>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(1)}>
        <View style={this.state.activeTabIndex===1 ?
          {flex:0.7,borderBottomWidth:2,borderColor:COLORS.RED}
        :{flex:0.7}}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 1
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Goal
            </Text>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(2)}>
        <View style={this.state.activeTabIndex===2 ?
          {flex:0.7,borderBottomWidth:2,borderColor:COLORS.RED}
        :{flex:0.7}}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 2
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Add Exercise
            </Text>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(3)}>
        <View style={this.state.activeTabIndex===3 ?
          {flex:0.7,borderBottomWidth:2,borderColor:COLORS.RED}
        :{flex:0.7}}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 3
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Tips
            </Text>
            </View>
        </TouchableWithoutFeedback>
      </View>

    )
  }


  render() {

    return (
      <SafeAreaView style={styles.container}>
          <View style={{height:'8%'}}>
         <Header
          navigation={this.props.navigation}
          title={this.state.activeTabIndex === 0 ?'Exercise':
            this.state.activeTabIndex === 1?'Goal':
            this.state.activeTabIndex === 2?'Add Exercise':
            'Tips'
          }
          isHomePage={false}
          type='back'
        />
        </View>
        {this.Tabchange()}
        <ScrollView>
          <View>
            {this.state.activeTabIndex === 0 ?
              <Exercise navigation={this.props.navigation}
                userDetailsId={this.props.userDetailsId}
                fname={this.props.fname}
                lname={this.props.lname}
                profile={this.props.profile_image}
              />
              : this.state.activeTabIndex === 1 ?
                <Goal navigation={this.props.navigation}
                  userDetailsId={this.props.userDetailsId} 
                  fname={this.props.fname}
                  profile={this.props.profile_image}
                    lname={this.props.lname}/>
                : this.state.activeTabIndex === 2 ?
                  <AddExercise navigation={this.props.navigation}
                    userDetailsId={this.props.userDetailsId}
                    fname={this.props.fname}
                    lname={this.props.lname}
                    profile={this.props.profile_image} />
                  : <TrainerTips navigation={this.props.navigation}
                    fname={this.props.fname}
                    lname={this.props.lname}
                    profile={this.props.profile_image}
                    userDetailsId={this.props.userDetailsId}
                    trainerId={this.props.trainerId}
                  />}
          </View>


        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    // elevation: 1,
    // zIndex: 1,
    flexDirection: "row",
    // borderTopWidth:0.5
    paddingBottom:-5,
  },
  tab: {
    // flex: 0.5,
    textAlign: "center",
    textAlignVertical: "center",
    // marginLeft: 20,
    // marginRight: 20,
    alignSelf: "center"
  },
  activeTab: {
    // borderBottomColor: COLORS.RED,
    // borderBottomWidth: 2,
    padding: 10,
    fontSize: 13,
    color: COLORS.RED,
    fontFamily: FONT.FAMILY.REGULAR
    //fontWeight: 'bold',
  },
  inactiveTab: {
    fontSize: 13,
    color: COLORS.GRAY,
    padding: 10,
    fontFamily: FONT.FAMILY.REGULAR,
  },


})