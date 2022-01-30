import React,{useEffect,useState} from 'react';
import RoutesNavigator from './App/Utils/RoutesNavigator';
import {Provider} from 'react-redux';
import {LogBox,Alert,StatusBar,View} from 'react-native';
// import reduxStore from './App/Redux/reduxConfig';
import {store,persistor} from './App/redux/store';
import { PersistGate } from 'redux-persist/es/integration/react';
import stripe from 'tipsi-stripe';


stripe.setOptions({
  publishableKey:"pk_live_51JHOONL50adRyLAuleuOmKaDSjOqvHSYNXIRb31J4Yc99dxdHlN2TXOA6u9b0DZLHGE5IzqIY0aJ4NW91crx52pP00X52IzgIa",
})

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : 0

const App = () => {
  
 
const  StatusBarPlaceHolder=()=>{
		return (
			<View style={{
				 height: STATUS_BAR_HEIGHT,
				 backgroundColor:'white'
			}}>
				<StatusBar
          barStyle="dark-content" 
          backgroundColor='white'
          
				/>
			</View>
		);
	}

  return (
    <Provider store={store}>
     	<PersistGate
					loading={null}
					persistor={persistor}>
            {StatusBarPlaceHolder()}

        <RoutesNavigator/>
        </PersistGate>
    </Provider>
  );
};

LogBox.ignoreAllLogs();

export default App;
