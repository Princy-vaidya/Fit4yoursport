import React, { useState,useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity ,SafeAreaView} from 'react-native';
import { COLORS, FONT } from '../Utils/constants'
import {getUserId,getToken,setNotifyCount,getNotifyCount} from '../Utils/Preference'
// import DrawerComponent from '../Container/DrawerComponent'
import Network from '../Services/Network'
import { saveUserNotification } from '../redux/actions/saveNotifyAction'
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

function BottomTabBar(props) {
    const [routeName, setRoutName] = useState('Home')


    useEffect(function () {
        getNotification()
      
      }, []);
      
   const getNotification=async()=>{
        const id = await getUserId()
        const token = await getToken()
        
    
        Network(`/user-notification-list?user_id=${id}&page =1&limit=20`, 'get', '', token)
          .then(async function (response) {
            
            var userDetails = {};
        userDetails.notification = response.response_data.total_unread_msg
         saveUserNotification(userDetails);

        
        //  await setNotifyCount(response.response_data.total_unread_msg)
console.log('value',response.response_data.total_unread_msg)
 await AsyncStorage.setItem('count', JSON.stringify(response.response_data.total_unread_msg)) 

 await AsyncStorage.getItem("count").then((count) => {
    
 }).done();
             })
         
          .catch(function (error) {
            
            console.log(JSON.stringify(error));
          });
    
}
    

    const handleNavigation = (routeName) => {
        props.navigation.navigate(routeName);
        setRoutName(routeName)
    };

    return (

        <SafeAreaView style={styles.parentCont}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('Home')}
                style={styles.iconContainer}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/home.png')}
                    style={routeName === 'Home' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'Home' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('MyGoal')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/goal.png')}
                    style={routeName === 'MyGoal' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'MyGoal' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('Program')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/shout.png')}
                    style={routeName === 'Program' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'Program' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Program</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('Subscription')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/subscription.png')}
                    style={routeName === 'Subscription' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'Subscription' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Subscription</Text>
            </TouchableOpacity>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    parentCont: {
        // width: '100%',
        // height: '8%',
        // paddingTop:7,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#DADADA',
        borderWidth: 1,
        borderStyle: 'solid',
    },

    iconContainer: {

        alignItems: 'center',
        justifyContent: 'center',
        marginTop:5
    },
    inActiveIcon: {
        width: 25,
        height: 25,
        tintColor: COLORS.GRAY
    },
    activeIcon: {
        width: 25,
        height: 25,
        tintColor: COLORS.RED
    },
    activeText: {
        fontFamily: FONT.FAMILY.REGULAR,
        color: COLORS.RED,
        fontSize: 12,
        marginTop: 5
    },
    inActiveText: {
        fontFamily: FONT.FAMILY.REGULAR,
        color: COLORS.GRAY,
        fontSize: 12,
        marginTop: 5
    }
});

export default connect(null,{saveUserNotification})(BottomTabBar);