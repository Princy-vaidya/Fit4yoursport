import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  Picker,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import {HEIGHT, WIDTH, COLORS, GAP, FONT} from '../../Utils/constants';
import Loader from '../../Components/Common/Loader';
import Header from '../../Utils/Header';
import FoodNavigation from '../../Utils/FoodNavigation';

export default function Food(props) {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
        <Header
           navigation={props.navigation}
          title='Food'
          type='back'
         />
      <ScrollView>
        <Loader loading={loading} />
        <KeyboardAvoidingView style={{}}>
          
          <FoodNavigation />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: COLORS.WHITE,
  },
});
