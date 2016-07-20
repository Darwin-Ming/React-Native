/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { PeripheralListView } from  './BluetoothView/PeripheralListView';
import { ServiceListView } from './BluetoothView/ServiceListView';
import { CharacteristicListView } from './BluetoothView/CharacteristicListView';
import { CommunicationWithPeripheral } from '/BluetoothView/CommunicationWithPeripheral';

var buletooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');


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

    this.didDiscoverPeripheralNotification;
    this.didConnectPeripheralNotification;
    this.didDiscoverServicesNotification;
    this.didDiscoverCharacteristicNotification;
    this.centralManagerStateChangeNotification;

    this.state = {
      bluetoothPowerState: false,
      bluetoothPeripheral: {},
    };

    buletooth.creatCenteralManager();
  }

  componentDidMount() {
    this.centralManagerStateChangeNotification = NativeAppEventEmitter.addListener(
      'centralManagerStateChange', (bluetooth) => {
          this.state.bluetoothPowerState = bluetooth.powerState;
          if (this.state.bluetoothPowerState) {
            console.log('\npowerState: ' + powerState.powerState + '\n');
            buletooth.searchlinkDevice();
            console.log('开始搜索周边设备');
          }

       }
    );

    this.didDiscoverPeripheralNotification = NativeAppEventEmitter.addListener(
        'didDiscoverPeripheral', () => {}
    );

    this.didConnectPeripheralNotification = NativeAppEventEmitter.addListener(
        'didConnectPeripheral', () => {}
    );

    this.didDiscoverServicesNotifiction = NativeAppEventEmitter.addListener(
        'didDiscoverServices', () => {}
    );

    this.didDiscoverCharacteristicNotification = NativeAppEventEmitter.addListener(
        'didDiscoverCharacteristics', () => {}
    );
  }

  componentWillUnmount() {
    this.centralManagerStateChangeNotification.remove();
    this.didDiscoverPeripheralNotification.remove();
    this.didConnectPeripheralNotification.remove();
    this.didDiscoverServicesNotifiction.remove();
    this.didDiscoverCharacteristicNotification.remove();
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
