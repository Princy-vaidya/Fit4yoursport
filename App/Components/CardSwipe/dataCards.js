import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {GAP, FONT, COLORS, HEIGHT} from '../../Utils/constants';
import {globalStyle} from '../../Utils/styles'

export function Bio(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <Text style={styles.bioDetails}>{props.content}</Text>
    </View>
  );
}

export function About(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/load.png')} style={styles.iconSize} />
          <Text style={styles.text}>Single</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Height.png')} style={styles.iconSize} />
          <Text style={styles.text}>165 cm</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Message.png')} style={styles.iconSize} />
          <Text style={styles.text}>Speaks Hindi</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Message.png')} style={styles.iconSize} />
          <Text style={styles.text}>Speaks Urdu</Text>
        </View>
      </View>
    </View>
  );
}

export function Career(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Student.png')} style={styles.iconSize} />
          <Text style={styles.text}>MBA</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Box.png')} style={styles.iconSize} />
          <Text style={styles.text}>Designer</Text>
        </View>
      </View>
    </View>
  );
}

export function Religion(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Moon.png')} style={styles.iconSize} />
          <Text style={styles.text}>Sunni</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Clock.png')} style={styles.iconSize} />
          <Text style={styles.text}>Usally prays</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Spoon.png')} style={styles.iconSize} />
          <Text style={styles.text}>Eat Halal</Text>
        </View>
      </View>
    </View>
  );
}


export function MarrigeGoals(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Calender.png')} style={[styles.iconSize, {width: '7%'}]} />
          <Text style={styles.text}>Seeking marrige as soon as possible</Text>
        </View>
      </View>
    </View>
  );
}

export function MyBadges(props) {
  return (
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/tick.png')} style={[styles.iconSize, {width: '20%'}]} />
          <Text style={styles.text}>Polite</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Man.png')} style={styles.iconSize} />
          <Text style={styles.text}>Serious</Text>
        </View>
        <View style={styles.iconText}>
          <Image resizeMode="contain" source={require('../../Assets/Home/Hand.png')} style={styles.iconSize} />
          <Text style={styles.text}>Recomended</Text>
        </View>
      </View>
    </View>
  );
}

export function MyPhotos(props) {
  return (
  <>
    <View style={globalStyle.cardBox}>
      <Text style={styles.bioHead}>{props.title}</Text>
      <View style={styles.iconsRow}>
      <Text style={styles.text}>Here are some of my photos</Text>
      </View>
    </View>

    <View style={styles.photoView}>
      <Image source={require('../../Assets/Home/image.png')} style={styles.imageView} />
      <Image source={require('../../Assets/Home/image1.png')} style={styles.imageView} />
    </View>
  </>
  );
}

export function Options(props) {
  return (
  <>
    <Text onPress={props.onPress} style={styles.reportText}>favourite, report or block</Text>
  </>
  );
}



const styles = StyleSheet.create({
  bioHead: {
    fontFamily: FONT.FAMILY.SEMI_BOLD,
  },
  bioDetails: {
    fontFamily: FONT.FAMILY.REGULAR,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  iconText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  iconSize: {
    width: '15%'
  },
  text: {
    fontSize: FONT.SIZE.SMALL - 3,
    fontFamily: FONT.FAMILY.REGULAR
  },
  photoView: {
    marginVertical: GAP.SMALL,
  },
  imageView: {
    width: '95%',
    marginHorizontal: GAP.SMALL,
    height: HEIGHT * 0.5,
    borderRadius: 15,
    marginVertical: GAP.SMALL
  },
  reportText: {
    marginVertical: GAP.MEDIUM,
    fontFamily: FONT.FAMILY.SEMI_BOLD,
    color: COLORS.PRIMARY,
    fontSize: FONT.SIZE.MEDIUM,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});
