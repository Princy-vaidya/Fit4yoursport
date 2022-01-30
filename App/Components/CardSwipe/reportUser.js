import React from 'react';
import {View, Text, Modal, StyleSheet, Image} from 'react-native';
import { WIDTH, HEIGHT, COLORS, GAP, FONT } from '../../Utils/constants';
import ActionButtons from './actionButtons';

export default function reportUser({modalVisible, close}) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.content}>
            <Image resizeMode="contain " source={require('../../Assets/Report/graphics.png')} style={styles.graphics} />
            <View style={styles.contentContainer}>
              <Text style={styles.nameText}>Susan</Text>
              <Text style={styles.detailsText}>Take an action on this profile. Don't worry this is anonymous.</Text>
              <ActionButtons />
            </View>
            
          </View>
          <Text style={styles.closeText} onPress={close}>Cancel</Text>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    
  },
  content: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    width: WIDTH * 0.9,
    height: HEIGHT * 0.6,
    borderRadius: 20,
    padding: GAP.MEDIUM,
    shadowColor: "#4b644f",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

  },
  graphics: {
    width: WIDTH * 0.72,
    height: HEIGHT * 0.35,
    alignSelf: 'center'

  },
  closeText: {
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    fontSize: FONT.SIZE.LARGE,
    color: COLORS.PRIMARY,
    marginTop: '10%',
    textTransform: 'uppercase'
  },
  nameText: {
    fontFamily: FONT.FAMILY.BOLD,
    fontSize: FONT.SIZE.BIG + 5,
    marginVertical: GAP.SMALL,
    marginTop: '-5%',
    textAlign: 'center'
  },
  detailsText: {
    textAlign: 'center',
    fontFamily: FONT.FAMILY.REGULAR,
    fontSize: FONT.SIZE.MEDIUM,
    color: 'gray',
    marginBottom: '5%'
  },
  contentContainer: {
    position:'absolute',
    bottom: '8%'
  }
})