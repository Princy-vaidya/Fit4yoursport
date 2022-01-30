import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity ,SafeAreaView} from 'react-native';
import { COLORS, FONT } from '../Utils/constants'

// import DrawerComponent from '../Container/DrawerComponent'


function TrainerBottomTab(props) {
    const [routeName, setRoutName] = useState('Home')

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
                onPress={() => handleNavigation('StudentList')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/Studentlist.png')}
                    style={routeName === 'StudentList' ?
                        [styles.activeIcon,{width:35,height:35}] :
                        [styles.inActiveIcon,{width:35,height:35}]} />
                <Text style={routeName === 'StudentList' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Student List</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('VideoTrainer')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Auths/video.png')}
                    style={routeName === 'VideoTrainer' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'VideoTrainer' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNavigation('ChatList')}
                style={styles.iconContainer}
            >
                <Image source={require('../Assets/Home/Message_tab.png')}
                    style={routeName === 'ChatList' ?
                        styles.activeIcon :
                        styles.inActiveIcon} />
                <Text style={routeName === 'ChatList' ?
                    styles.activeText :
                    styles.inActiveText}>
                    Chat</Text>
            </TouchableOpacity>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    parentCont: {
        // width: '100%',
        // height: '8%',
       
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
    },
    inActiveIcon: {
        width: 25,
        height: 25,
        tintColor: COLORS.GRAY
    },
    activeIcon: {
        width: 26,
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

export default TrainerBottomTab;