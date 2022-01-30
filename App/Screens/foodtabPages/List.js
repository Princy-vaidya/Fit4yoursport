import React, {useState, useEffect} from 'react';
import {View, Text, Image, Dimensions, FlatList} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from '../../Utils/constants';
import {getToken, getUserId, setUserId} from '../../Utils/Preference';
import Network from '../../Services/Network';
import Toast from 'react-native-simple-toast';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function List(props) {
  const currentDate =
    new Date().getFullYear() +
    '-' +
    (new Date().getMonth() + 1) +
    '-' +
    new Date().getDate();
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [foodName, setFoodName] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(function () {
    token();
    lisener();
  }, []);

  const lisener = () => {
    props.navigation.addListener('focus', async () => {
      token();
    });
  };
  const token = async () => {
    try {
      const token = await getToken();
      const id = await getUserId();
      setAuthToken(token);
      setUserId(id);
      getFoodList(token, id);
    } catch (e) {}
  };

  //   const data = [
  //     {id: '1', button: '1'},
  //     {id: '2', button: '2'},
  //     {id: '3', button: '3'},
  //   ];

  const getFoodList = (token, id) => {
    Network(
      '/list-food?user_id=' + id + '&date=' + currentDate,
      'get',
      '',
      token,
    )
      .then(function (response) {
        setFoodName(response.response_data.docs);
        console.log('foodList', response.response_data.docs);
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  const deleteItemFromArray = (index, foodId) => {
    const array = foodName;
    array.splice(index, 1);
    setRefresh(!refresh);
    setFoodName(array);
    deleteItem(foodId);
    console.log('Item', JSON.stringify(foodName));
  };

  const deleteItem = (foodId) => {
    Network('/delete-food?_id=' + foodId, 'get', '', authToken)
      .then(function (response) {
        console.log('foodList', JSON.stringify(response));
      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {console.log('refresh ', refresh)}
     {foodName.length!=0 ? 
      <FlatList
        style={{marginTop: 10}}
        data={foodName}
        extraData={refresh}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{paddingStart: 30, paddingVertical: 10}}>
              <Text
                style={{
                  color: COLORS.BLACK,
                  fontWeight: 'bold',
                }}>
                {item.food_name}
              </Text>
              <Text
                style={{
                  color: COLORS.GRAY,
                  marginTop: 8,
                }}>
                {item.serving_size} {item.unit}
              </Text>

              <Text
                style={{
                  color: COLORS.GRAY,
                  marginTop: 8,
                }}>
                {item.meal_type}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteItemFromArray(index, item._id)}>
              <Image
                source={require('../../Assets/Auths/delete.png')}
                style={{
                  width: 20,
                  height: 20,
                  margin: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      />:
      <Text style={{textAlign:'center',color:COLORS.RED,fontFamily:FONT.FAMILY.REGULAR,marginTop:10}}>
        Food list not found.
        </Text>}
    </View>
  );
}
