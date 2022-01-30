import React, {useState,Component} from 'react';
import {View, Text, Image, Dimensions,StyleSheet,TouchableWithoutFeedback,ScrollView,SafeAreaView} from 'react-native';
import Header from '../../Utils/Header';
import {COLORS, HEIGHT, WIDTH,FONT} from '../../Utils/constants';
import TrackExercise from '../../Screens/mygoalPages/TrackExercise';
import AddExercise from '../../Screens/mygoalPages/AddExercise';
import Exercise from '../../Screens/mygoalPages/Exercise';
import Goal from '../../Screens/mygoalPages/Gaol';

// export default function MyGoal({navigation}) {
//   return (
//     <View style={{flex: 1, backgroundColor: 'white'}}>
//       <View style={{backgroundColor: '#949494', width: '100%', height: 0.5}} />
//       <MyGoalNavigation />
//     </View>
//   );
// }
export default class MyGoal extends Component {
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
        {/* <TouchableWithoutFeedback onPress={() => this.onTabChange(0)} >
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 0
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
           My Goal
            </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(1)}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 1
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Exercise
            </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onTabChange(2)}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 2
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Track Exercise
            </Text>
        </TouchableWithoutFeedback> */}

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
           My Goal
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
           Exercise
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
            Track Exercise
            </Text>
            </View>
        </TouchableWithoutFeedback>
      
       
        {/* <TouchableWithoutFeedback onPress={() => this.onTabChange(3)}>
          <Text
            style={[
              styles.tab,
              this.state.activeTabIndex === 3
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            Add Exercise
            </Text>
        </TouchableWithoutFeedback> */}
      </View>

    )
  }


  render() {

    return (
      <SafeAreaView style={styles.container}>
         
         <Header
           navigation={this.props.navigation}
          title={this.state.activeTabIndex === 0?'My Goal':
          this.state.activeTabIndex === 1?'Exercise':
          this.state.activeTabIndex === 2?'Track Exercise':
        'Add Exercise'}
          type='menu'
          onPress={this.props.naviagtion}
         />
        
        {this.Tabchange()}
        <ScrollView>
          <View>
            {this.state.activeTabIndex === 0 ?
              <Goal navigation={this.props.navigation}/>
              : this.state.activeTabIndex === 1 ?
                <Exercise navigation={this.props.navigation}/>
                : this.state.activeTabIndex === 2 ?
                  <TrackExercise navigation={this.props.navigation} />
                  :  <AddExercise navigation={this.props.navigation} />}
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
    marginBottom:10

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


