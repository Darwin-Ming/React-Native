import React, { Component } from 'react';
import {
    ListView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
var { NativeAppEventEmitter } = require('react-native');
var bluetooth = require('react-native').NativeModules.ConnetionWithBlueTooth;

import { CharacteristicListView } from './CharacteristicListView';

export class ServiceListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };

        this.didDiscoverServicesNotification = NativeAppEventEmitter.addListener(
            'didDiscoverServices', (services) => {
                console.log('发现服务.');
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(services),
                });
            }
        );

        this.didConnectPeripheralNotification;
        this.didDiscoverServicesNotification;
    }

    componentWillMount() {
        this.didConnectPeripheralNotification = NativeAppEventEmitter.addListener(
            'didConnectPeripheral', (peripheral) => {
                bluetooth.discoverService();
                console.log('连接Bluetooth成功,开始扫描服务 。。。。。。');
            }
        );
    }

    componentWillUnmount() {
        this.didConnectPeripheralNotification.remove();
        this.didDiscoverServicesNotification.remove();
    }

    render() {
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderService.bind(this)}
                style={styles.container}
            />
        );
    }

    _renderService(rowData) {
        return(
            <TouchableOpacity onPress={() => this._pressDiscriptionCell(rowData)}>
                <View style={styles.discriptionCell}>
                    <Text>
                        { '\nServiceUUID: ' + rowData.serviceUUID + rowData.serviceCharacteristics}
                    </Text>
                    <Text>
                        { }
                    </Text>
                </View>
            </TouchableOpacity>
        );　　　　　　　　
    }

    _pressDiscriptionCell(rowData) {
        console.log('_pressDiscriptionCell');
        this.props.navigator.push({
            name: CharacteristicListView,
            index: rowData.serviceUUID,
        });

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: 64,
    },
    discriptionCell: {
        flex: 1,
        backgroundColor: '#892810',
    },
});
