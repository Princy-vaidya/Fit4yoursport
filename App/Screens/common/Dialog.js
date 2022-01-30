import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {COLORS, HEIGHT, WIDTH} from '../../Utils/constants';

export default function Dialog(props) {
  const {isVisible, onValueSelected, title, type, activityList,onCancel} = props;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {
        isVisible;
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.6)',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '80%',
            alignItems: 'center',
            borderRadius: 6,
            elevation: 4,
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 10,
              marginTop: 10,
              color:COLORS.GRAY
            }}>
            {title}
          </Text>

          <View
            style={{
              width: '100%',
              height: 400,
            }}>
            <FlatList
              style={{flex: 1}}
              data={activityList}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueSelected(item);
                  }}>
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      padding: 8,
                    }}>
                    <Text style={{marginLeft: 10}}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: COLORS.PRIMARY,
              borderBottomStartRadius: 6,
              borderBottomEndRadius: 6,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                padding: 10,
                textAlign: 'center',
                flex: 1,
              }}
              onPress={() => {
                onCancel();
              }}>
              Cancel
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
