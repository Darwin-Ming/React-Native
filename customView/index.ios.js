/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var buletooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');
import { PeripheralListView } from  './BluetoothView/PeripheralListView';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
} from 'react-native';

class customView extends Component {

  constructor(props) {
    super(props);
    this.aaa;
    this.a;
    this.discoverPeripheralDeviceNotifiction;

    this.state = {
      bluetoothPowerState: false,
      bluetoothPeripheral: {},
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
            console.log('powerState' + powerState.powerState);
            buletooth.searchlinkDevice();
            console.log('开始搜索周边设备');
          }

       }
      );




  }

  componentWillUnmount() {
    this.aaa.remove();
    this.a.remove();
  }

  startSearchPeripheralDevice() {
    if (this.state.bluePowerState) {
      buletooth.searchlinkDevice();
    }
  }

  render() {
    return (
        <Navigator
            initralRoute={{name: 'bluetooth', index: 0}}
            renderScene={(route, navigator) =>
                <PeripheralListView />
                }
        >
        </Navigator>
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
