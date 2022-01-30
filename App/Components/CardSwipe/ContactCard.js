import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

import {COLORS, HEIGHT, WIDTH ,FONT} from '../../Utils/constants';


const ContactCard = ({ item, onItemPress }) => {

    return (
        <TouchableWithoutFeedback
            onPress={() => { onItemPress() }}>
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={item.profile_image===null?
                        require('../../Assets/Auths/user.png')
                    :{uri:'https://fit4yoursport.dk:1446/'+item.profile_image}} />
                <View flex={1} >
                    <Text style={styles.title}>{item.value}  {item.lname}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        padding: 5,
        elevation: 0.1,
        marginLeft: 20,
        marginRight: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    image: {
        margin: 10,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor:COLORS.GRAY
        // resizeMode:'cover'
    },
    title: {
        fontSize: FONT.SIZE.MEDIUM,
        color: COLORS.BLACK,
        fontFamily: FONT.FAMILY.SEMI_BOLD,
        textAlignVertical:'center'
    },
    message: {
        fontSize: 14,
        color: COLORS.LIGHTGRAY,
        fontFamily:FONT.FAMILY.REGULAR
    }
});


export default ContactCard;