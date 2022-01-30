import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import stripe from 'tipsi-stripe';
import Button from '../tripsi/Button';
import testID from '../Utils/testID';
import axios from 'axios';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Header from '../Utils/Header';
import Network from '../Services/Network';
import { getToken, getUserName, getUserEmail, getUserId } from '../Utils/Preference'
import Toast from 'react-native-simple-toast';
import Loader from '../Components/Common/Loader';

stripe.setOptions({
  publishableKey: "pk_live_51JHOONL50adRyLAuleuOmKaDSjOqvHSYNXIRb31J4Yc99dxdHlN2TXOA6u9b0DZLHGE5IzqIY0aJ4NW91crx52pP00X52IzgIa",
})
export default class CardFormScreen extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    paymentMethod: null,

  };



  handleCardPayPress = async () => {

    const name = await getUserName();
    const email = await getUserEmail();
    const demoCardFormParameters = {
      // Only iOS support this options
      smsAutofillDisabled: true,
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
          name: name,
          email: email,
        },
      },
    }


    try {
      this.setState({ loading: true, paymentMethod: null })

      const paymentMethod = await stripe.paymentRequestWithCardForm()
      this.setState({
        paymentMethod: paymentMethod
      })

      console.log(paymentMethod.id)

      if (this.props.route.params.packageId === '' || this.props.route.params.packageId === null || this.props.route.params.packageId === undefined) {
        this.onPayment();
      } else {
        console.log('payment....')
        this.onStandardPayment()
      }

      this.setState({ loading: false, paymentMethod })
    } catch (error) {
      this.setState({ loading: false })
      alert(error)
    }
  }

  makePayment = async () => {
    this.setState({
      loading: true
    })


  }

  onPayment = async () => {

    const token = await getToken();
    const name = await getUserName();
    const email = await getUserEmail();
    const userId = await getUserId();
    let formdata = new FormData();
    formdata.append('name', name)
    formdata.append('email', email)
    formdata.append('stripe_pm_id', this.state.paymentMethod.id)
    formdata.append('user_id', userId)
    formdata.append('trainer_id', this.props.route.params.data._id)
    formdata.append('description', this.props.route.params.subDesc)
    formdata.append('subscription_type', this.props.route.params.subType)

    console.log('formdata', formdata);
    this.setState({
      loading: true
    })
    //  setLoading(true)
    Network('/payment', 'POST', formdata, token)
      .then(async (res) => {
        console.log(' Successful==>' + JSON.stringify(res));
        // setLoading(false)
        this.setState({
          loading: false
        })
        if (res.response_code == 2000) {

          console.log('payments gg',res)
 
          Toast.show(res.response_message);
          this.props.navigation.navigate('PaymentSuccess',
            {
              trainerId: this.props.route.params.data._id,
              subType: this.props.route.params.subType
            })

          
        } else {
          
          Toast.show(res.response_message);
          this.props.navigation.navigate('PaymentFail')
          
        }
      })
      .catch((err) => {
        console.log('Error --' + JSON.stringify(err));
      });

  }


  onStandardPayment = async () => {

    const token = await getToken();
    const name = await getUserName();
    const email = await getUserEmail();
    const userId = await getUserId();
    let formdata = new FormData();
    formdata.append('name', name)
    formdata.append('email', email)
    formdata.append('stripe_pm_id', this.state.paymentMethod.id)
    formdata.append('user_id', userId)
    formdata.append('package_id', this.props.route.params.packageId)
    formdata.append('description', 'STANDARD PROGRAM SUBSCRIPTION')
    formdata.append('subscription_type', 'STANDARD_PROGRAM')

    console.log('formdata', formdata);
    this.setState({
      loading: true
    })
    Network('/payment', 'POST', formdata, token)
      .then(async (res) => {
        console.log('hello')
        console.log(' Successful==>' + JSON.stringify(res));
        this.setState({
          loading: false
        })
        if (res.response_code == 2000) {

          Toast.show(res.response_message);
          this.props.navigation.navigate('PaymentSuccess',
            {
              packageId: this.props.route.params.packageId,
              subType: this.props.route.params.subType
            })

        } else {

          Toast.show(res.response_message);
          this.props.navigation.navigate('PaymentFail')
        }
      })
      .catch((err) => {
        console.log('Error --' + JSON.stringify(err));
      });

  }

  render() {
    const { loading, paymentMethod } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Header
          type='back'
          title='Payment Process'
          navigation={this.props.navigation} />

        <View style={styles.maincontainer}>

          <Image source={require('../Assets/Auths/card.png')}
            style={{ width: 200, height: 200 }} />
          <Text style={styles.header}>Click button to show Card Form dialog.</Text>

          <Button
            text="Enter your card and pay"
            loading={loading}
            onPress={this.handleCardPayPress}
            {...testID('cardFormButton')}
          />
          <View style={styles.paymentMethod}
            {...testID('cardFormPaymentMethod')}
          >
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white'
  },
  maincontainer: {
    // width:'90%',
    flex: 1,
    margin: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 20,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  paymentMethod: {
    height: 20,
  },
})
