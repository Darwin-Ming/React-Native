import React, { Component } from 'react';
import {
    ListView,
    Navigator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

var bluetooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');

import { CommunicationWithPeripheral } from './CommunicationWithPeripheral';

class CharacteristicListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };

        this.didDiscoverCharacteristicNotification;

        bluetooth.didDiscoverCharacteristicsForService(this.props.UUID);
    }

    componentWillMount() {
        this.didDiscoverCharacteristicNotification = NativeAppEventEmitter.addListener(
            'didDiscoverCharacteristics', (characteristics) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(characteristics),
                });
            }
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.didDiscoverCharacteristicNotification.remove();
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                style={styles.container}
            />
        )
    }

    _renderRow(rowData) {
        return(
            <TouchableOpacity onPress={() => this._onPress(rowData)}>
                <View>
                    <Text>
                        {'\n characteristicUUID: \n' + rowData.characteristicUUID +
                        '\n characteristicDescriptors: ' + rowData.characteristicDescriptors +
                        '\n characteristicProperties: ' + rowData.characteristicProperties}
                    </Text>
                </View>
            </TouchableOpacity>
      )
    }

    _onPress(rowData) {
        console.log(rowData.characteristicUUID);
        bluetooth.writeValueForDescriptor(rowData.characteristicUUID, '数据就是没有数据');
        this.props.navigator.push({
            name: CommunicationWithPeripheral,
            navigator: this.props.navigator,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AACCFF',
        marginTop: 64,
    },
});

export { CharacteristicListView };
