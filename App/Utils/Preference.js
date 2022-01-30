import AsyncStorage from '@react-native-community/async-storage';

var setSessionKey = async function (sessionKey) {
  await AsyncStorage.setItem('sessionKey', sessionKey);
};

var getSessionKey = async function () {
  return await AsyncStorage.getItem('sessionKey');
};
var setToken = async function (token) {
  await AsyncStorage.setItem('token', token);
};

var getToken = async function () {
  return await AsyncStorage.getItem('token');
};
var setUserId = async function (userId) {
  await AsyncStorage.setItem('userId', userId);
};
var getUserId = async function () {
  return await AsyncStorage.getItem('userId');
};
var setUserType = async function (userId) {
  await AsyncStorage.setItem('userType', userId);
};
var getUserType = async function () {
  return await AsyncStorage.getItem('userType');
};
var setActionType = async function (action) {
  await AsyncStorage.setItem('actionType', action);
};
var getActionType = async function () {
  return await AsyncStorage.getItem('actionType');
};
var setUserProfileImage = async function (userId) {
  await AsyncStorage.setItem('userImage', userId);
};
var getUserProfileImage = async function () {
  return await AsyncStorage.getItem('userImage');
};
var setUserName = async function (userId) {
  await AsyncStorage.setItem('userName', userId);
};
var getUserName = async function () {
  return await AsyncStorage.getItem('userName');
};

var setUserEmail = async function (userId) {
  await AsyncStorage.setItem('userEmail', userId);
};
var getUserEmail = async function () {
  return await AsyncStorage.getItem('userEmail');
};

var setGoal = async function (userId) {
  await AsyncStorage.setItem('getGoal', userId);
};
var getGoal = async function () {
  return await AsyncStorage.getItem('getGoal');
};

var  setDeviceToken =async function (token) {
  await AsyncStorage.setItem('deviceToken', token);
};
var  getDeviceToken = async function () {
  return await AsyncStorage.getItem('deviceToken');
};

var  setNotifyCount =async function (count) {
  await AsyncStorage.setItem('count', JSON.parse(count));
};
var  getNotifyCount = async function () {
  return await AsyncStorage.getItem('count');
};

export {
  setSessionKey,
  getSessionKey,
  setToken,
  getToken,
  setUserId,
  getUserId,
  setUserType,
  getUserType,
  getUserProfileImage,
  setUserProfileImage,
  getUserName,
  setUserName,
  setUserEmail,
  getUserEmail,
  setGoal,
  getGoal,
  setDeviceToken,
  getDeviceToken,
  setNotifyCount,
  getNotifyCount,
  setActionType,
  getActionType
};
