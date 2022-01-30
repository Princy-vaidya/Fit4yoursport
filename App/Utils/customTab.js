import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import * as Animatable from 'react-native-animatable';
import { COLORS, HEIGHT, WIDTH, FONT } from './constants';

function MyTabBar({ state, descriptors, navigation }) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
  
    if (focusedOptions.tabBarVisible === false) {
      return null;
    }
  
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: HEIGHT * 0.020, paddingBottom: HEIGHT * 0.035}}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          let iconName;
          if (route.name === 'Discover') {
            iconName = isFocused ? require('../Assets/Home/home.png') : require('../Assets/Home/Home-Inactive.png');
          } else if (route.name === 'Search') {
            iconName = isFocused ? require('../Assets/Home/search-Inactive.png') : require('../Assets/Home/Search.png');
          } else if (route.name === 'Message') {
            iconName = isFocused ? require('../Assets/Home/Message-Active.png') : require('../Assets/Home/Message_tab.png');
          } else if (route.name === 'Settings') {
            iconName = isFocused ? require('../Assets/Home/Setting-Active.png') : require('../Assets/Home/Setting.png');
          }
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{  height: HEIGHT * 0.03, alignItems: 'center', flexDirection: 'row', justifyContent:'center' }}
            >
              <Animatable.Image animation="rubberBand" source={iconName} resizeMode="contain" style={{width: WIDTH * 0.09, height: HEIGHT * 0.03}} color={isFocused ? COLORS.PRIMARY : '#222'} />
              {isFocused && <Animatable.Text animation="rubberBand" style={{ color: isFocused ? COLORS.PRIMARY : '#222', fontFamily: FONT.FAMILY.SEMI_BOLD, fontSize: FONT.SIZE.SMALL }}> 
                {label}
              </Animatable.Text> }
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  export default MyTabBar