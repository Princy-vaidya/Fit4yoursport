import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from 'react-native';
// import Home from './../Screens/Home';
import Signup from './../Screens/AuthScreens/signup';
import EmailVarifyScreeen from './../Screens/AuthScreens/otpVerify';
import ForgotPassword from '../Screens/AuthScreens/forgotPassword';
import createNewPassword from '../Screens/AuthScreens/createNewPassword';
import Splash from './../Screens/splash';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';
import {HEIGHT, COLORS, WIDTH, FONT} from './constants';
import {useSelector} from 'react-redux';
import MyTabBar from './customTab';
import Dashboard from '../Screens/homepage/Dashboard';
import MyGoal from '../Screens/bottompage/MyGoal';
import Subscription from '../Screens/bottompage/Subscription';
import Program from '../Screens/bottompage/Program';
import Exercise from '../Screens/programTabPages/Exercise';
import Videos from '../Screens/programTabPages/Videos';
import Tips from '../Screens/programTabPages/Tips';
import Goal from '../Screens/mygoalPages/Gaol';
import exercise from '../Screens/mygoalPages/Exercise';
import TrackExercise from '../Screens/mygoalPages/TrackExercise';
import AddExercise from '../Screens/mygoalPages/AddExercise';
import Profile from '../Screens/homepage/Profile';
import InviteGuest from '../Screens/homepage/InviteGuest';
import MySlot from '../Screens/homepage/MySlot';

import ContactTrainer from '../Screens/subscriptionPage/ContactTrainer';
import MyPlan from '../Screens/subscriptionPage/MyPlan';
import Food from '../Screens/homepage/Food';
import List from '../Screens/foodtabPages/List';
import CustomFood from '../Screens/foodtabPages/CustomFood';
import MealTime from '../Screens/foodtabPages/MealTime';
import TrainerDashboard from '../Screens/homepage/TrainerDashboard';
import VideoCall from '../Screens/subscriptionPage/VideoCall';
import VideoCallTrainer from '../Screens/TrainerScreen/VideoCallTrainer';
import Chat from '../Screens/subscriptionPage/Chat';
import ChatUser from '../Screens/subscriptionPage/ChatUser';
import TrainerStudentList from '../Screens/bottompage/TrainerStudentList';
import TrainerdetailTab from '../Screens/bottompage/TrainerdetailTab ';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
// import MyDrawer from '../Utils/DrawerContainer'
import {createDrawerNavigator} from '@react-navigation/drawer';
import NavigationDrawer from '../Screens/bottompage/NavigationDrawer';
import BottomTabBar from '../Utils/BottomTabBar';
import TrainerTips from '../Screens/homepage/TrainerTips';
import TrainerBottomTab from '../Utils/TrainerBottomTab';
import Video from '../Screens/TrainerScreen/Videos';
import {useAuth} from '../Auth/useAuth';
import {AuthContext} from '../contexts/AuthContext';
import Notes from '../Utils/Notes';
import ChatList from '../Screens/subscriptionPage/ChatList';
import Notification from '../Screens/Notification/Notification';
import Login from '../Screens/AuthScreens/login';
import NotificationMessage from '../Screens/Notification/NotificationMessage';
import {navigationRef} from '../Screens/Notification/NotifyNavigator';
import CardFormScreen from '../scenes/CardFormScreen';
import PaymentHistory from '../Screens/subscriptionPage/PaymentHistory';
import Detail from '../Screens/subscriptionPage/Detail';
import PaymentSuccess from '../scenes/PaymentSuccess';
import PaymentFail from '../scenes/PaymentFail';
import MyAppoinment from '../Screens/homepage/MyAppoinment';
import linking from '../Screens/homepage/InviteGuest';
import {
  setUserId,
  setToken,
  setUserType,
  getUserType,
  setActionType,
} from '../Utils/Preference';
import Appoinment from '../Screens/homepage/Appoinment';
import standardExercise from '../Screens/subscriptionPage/standardExercise';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator headerMode="none" initialRouteName="Login">
      {/* <AuthStack.Screen name="Splash" component={Splash} /> */}
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Forgot Password',
          headerStyle: {backgroundColor: COLORS.WHITE},
        }}
        name="ForgotPass"
        component={ForgotPassword}
      />

      <AuthStack.Screen
        name="Verification"
        component={EmailVarifyScreeen}
        options={{
          headerShown: true,
          headerTitle: 'Verification Code',
          headerBackTitle: '',
          headerStyle: {backgroundColor: '#fff'},
        }}
      />

    </AuthStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Dashboard'}>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const Goals = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyGoal"
        component={MyGoal}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const Programs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Program"
        component={Program}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const Subscriptions = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CardFormScreen"
        component={CardFormScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentFail"
        component={PaymentFail}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Appoinment"
        component={Appoinment}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MyAppoinment"
        component={MyAppoinment}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStackTrainer = () => {
  return (
    <Stack.Navigator initialRouteName={'TrainerDashboard'}>
      <Stack.Screen
        name="TrainerDashboard"
        component={TrainerDashboard}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const StudentList = () => {
  return (
    <Stack.Navigator initialRouteName={'TrainerStudentList'}>
      <Stack.Screen
        name="TrainerStudentList"
        component={TrainerStudentList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TrainerdetailTab"
        component={TrainerdetailTab}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const VideoTrainer = () => {
  return (
    <Stack.Navigator initialRouteName={'Video'}>
      <Stack.Screen
        name="Video"
        component={Video}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const TabScreen = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      tabBarOptions={{
        activeTintColor: COLORS.PRIMARY,
        inactiveTintColor: COLORS.BLACK,
        inactiveBackgroundColor: COLORS.BLUE,
      }}>
      <Tab.Screen name="Home" component={HomeStack} />

      <Tab.Screen name="MyGoal" component={MyGoal} />

      <Tab.Screen name="Program" component={Programs} />

      <Tab.Screen name="Subscription" component={Subscriptions} />
      <Tab.Screen name="Notes" component={Notes} />
      <Tab.Screen name="Notification" component={Notification} />
    </Tab.Navigator>
  );
};

const TrainerTabScreen = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TrainerBottomTab {...props} />}
      tabBarOptions={{
        activeTintColor: COLORS.PRIMARY,
        inactiveTintColor: COLORS.BLACK,
        inactiveBackgroundColor: COLORS.BLUE,
      }}>
      <Tab.Screen name="Home" component={HomeStackTrainer} />

      <Tab.Screen name="StudentList" component={StudentList} />
      <Tab.Screen name="TrainerStudentList" component={TrainerStudentList} />

      <Tab.Screen name="PaymentHistory" component={PaymentHistory} />

      <Tab.Screen name="VideoTrainer" component={VideoTrainer} />
      <Tab.Screen name="ChatList" component={ChatList} />
      <Tab.Screen name="Notes" component={Notes} />
      <Tab.Screen name="Notification" component={Notification} />
    </Tab.Navigator>
  );
};

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerContent={(props) => <NavigationDrawer {...props} />}
      drawerContentOptions={{
        activeTintColor: '#e91e63',
      }}>
      <Drawer.Screen name="TabScreen" component={TabScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="InviteGuest" component={InviteGuest} />
      <Drawer.Screen name="MyAppoinment" component={MyAppoinment} />

      <Drawer.Screen
        options={{
          headerShown: true,
          headerTitle: 'New Password',
          headerStyle: {backgroundColor: COLORS.WHITE},
        }}
        name="NewPass"
        component={createNewPassword}
      />
      <Drawer.Screen name="Food" component={Food} />
      <Drawer.Screen name="Goal" component={Goal} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="Notes" component={Notes} />
      <Drawer.Screen
        name="VideoCall"
        component={VideoCall}
        options={({route}) => {
          return {
            gestureEnabled: getGestureEnabled(route),
          };
        }}
      />
      <Drawer.Screen
        name="ChatUser"
        component={ChatUser}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ContactTrainer"
        component={ContactTrainer}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Appoinment"
        component={Appoinment}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="standardExercise"
        component={standardExercise}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const DrawerTrainerScreen = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerContent={(props) => <NavigationDrawer {...props} />}
      drawerContentOptions={{
        activeTintColor: '#e91e63',
      }}>
      <Drawer.Screen name="Tab" component={TrainerTabScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Food" component={Food} />
      <Drawer.Screen name="Goal" component={Goal} />
      <Drawer.Screen name="Notes" component={Notes} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="InviteGuest" component={InviteGuest} />
      <Drawer.Screen name="MySlot" component={MySlot} />

      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="VideoCallTrainer"
        component={VideoCallTrainer}
        options={({route}) => {
          return {
            gestureEnabled: getGestureEnabled(route),
          };
        }}
      />

      <Drawer.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

const getGestureEnabled = (route) => {
  const routeName =
    getFocusedRouteNameFromRoute(route) ?? ('VideoCallTrainer' || 'VideoCall');
  switch (routeName) {
    case 'VideoCallTrainer':
      return false;
    case 'VideoCall':
      return false;
    default:
      return true;
  }
};

const RootStack = createStackNavigator();

export default function RoutesNavigator(props) {
  const [userMe, setUserToken] = useState(null);
  // const [userType, setUserType] = useState('');
  const [enable, setEnable] = React.useState(false);
  // const [userType, setUserType] = React.useState(false);

  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [linkFlagUser, setLinkFlagUser] = useState(false);
  const [linkFlagTrainer, setLinkFlagTrainer] = useState(false);
  // const isUserSignedIn = useSelector(state => state.loginReducer.isUserLoggedIn)

  const {auth, state} = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading);
    }, 2000);

    //  const value='Fit4yoursport://DrawerScreen/5feaf1a05bb3e4770985d248/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZWFmMWEwNWJiM2U0NzcwOTg1ZDI0OCIsImlhdCI6MTYxMzE2NTY4MCwiZXhwIjoxNjEzMjUyMDgwfQ.o8sdomEXRubIjZWy5-ez56uCfPCxF3Nhu-UdhlMGexw/user';
    //  console.log('id',value.substring(29,53))
    //  console.log('token',value.slice(54))
    // alert(value.substring(54,225))
    //  alert(value.slice(226))
    // 'Fit4yoursport://DrawerScreen/5feaf1a05bb3e4770985d248/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZWFmMWEwNWJiM2U0NzcwOTg1ZDI0OCIsImlhdCI6MTYxNTY2MjIyNSwiZXhwIjoxNjE4MjU0MjI1fQ.P3eAcDLkyq6i9jkOVDnKIQvkk5Eww_mykGdDQt4hLi4/user'

    //  const value='https://www.google.com/Fit4yoursport/5feaf1a05bb3e4770985d248/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZWFmMWEwNWJiM2U0NzcwOTg1ZDI0OCIsImlhdCI6MTYxMzE2NTY4MCwiZXhwIjoxNjEzMjUyMDgwfQ.o8sdomEXRubIjZWy5-ez56uCfPCxF3Nhu-UdhlMGexw/user';
    // //  alert(value.substring(29,53))
    // console.log('tt',value.substring(37,61))
    // alert(value.substring(62,233))
    // alert(value.slice(234))
    Linking.getInitialURL()
      .then(async (url) => {
        if (url) {
          console.log('Initial url is: ' + url);
          //   alert(url)
          if (Platform.OS === 'ios') {
            const id = url.substring(29, 53);
            const token = url.substring(54, 225);
            const user = url.slice(226).toString();
            const userType = user.toString();

            await setUserId(id);
            await setToken(token);
            await setUserType(user);
            await setActionType('true');

            if (userType === 'user') {
              setLinkFlagUser(true);
            } else {
              setLinkFlagTrainer(true);
            }
          } else {
            const id = url.substring(37, 61);
            const token = url.substring(62, 233);
            const userType = url.slice(234);
            await setUserId(id);
            await setToken(token);
            await setUserType(userType);
            await setActionType('true');

            //  alert(await getUserType())
            if (userType === 'user') {
              setLinkFlagUser(true);
            } else {
              setLinkFlagTrainer(true);
            }
          }
        } else {
          // alert('no')
        }
      })
      .catch((err) => alert(err));
  }, []);

  function returnScreens() {
    if (state.loading) {
      return <RootStack.Screen name={'Splash'} component={Splash} />;
    }
    return state.user === undefined ? (
      <RootStack.Screen name={'AuthStackScreen'} component={AuthStackScreen} />
    ) : state.user.token && state.user.userType === 'user' ? (
      <RootStack.Screen name={'DrawerScreen'}>
        {() => <DrawerScreen />}
      </RootStack.Screen>
    ) : (
      <RootStack.Screen name={'DrawerTrainerScreen'}>
        {() => <DrawerTrainerScreen />}
      </RootStack.Screen>
    );
  }

  function returnLinkUserScreens() {
    return (
      <RootStack.Screen name={'DrawerScreen'}>
        {() => <DrawerScreen />}
      </RootStack.Screen>
    );
  }

  function returnLinkTrainerScreens() {
    return (
      <RootStack.Screen name={'DrawerTrainerScreen'}>
        {() => <DrawerTrainerScreen />}
      </RootStack.Screen>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
          }}>
          {linkFlagUser
            ? returnLinkUserScreens()
            : linkFlagTrainer
            ? returnLinkTrainerScreens()
            : returnScreens()}
        </RootStack.Navigator>
        <NotificationMessage />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
