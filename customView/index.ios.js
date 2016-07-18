/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var buletooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

class customView extends Component {
 
  constructor(props) {
    super(props);
    this.aaa;
    this.a;
  
    this.state = {
      bluetoothPowerState: false,
    };
  }

  componentDidMount() {
    buletooth.creatCenteralManager();
    this.aaa = NativeAppEventEmitter.addListener(
      'EventReminder', (reminder) => Alert.alert(reminder.name + "aaa")
      );
    this.a = NativeAppEventEmitter.addListener(
      'centralManagerStateChange', (powerState) => { 
          this.state.bluetoothPowerState = powerState.powerState;  
          if (this.state.bluetoothPowerState) {
            console.log(powerState.powerState + '我擦呢');
          // if (true) {
            buletooth.searchlinkDevice();
            console.log('开始搜索周边设备');
          }

          // }
       }
      );
  }

  componentWillUnmount() {
    this.aaa.remove();
    this.a.remove()
  }

  startSearchPeripheralDevice() {
    if (this.state.bluePowerState) {
      buletooth.searchlinkDevice();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('customView', () => customView);
