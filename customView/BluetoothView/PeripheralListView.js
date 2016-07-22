import React, { Component } from 'react';
var bluetooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');

import { ServiceListView } from './ServiceListView';

import {
	View,
	Text,
	StyleSheet,
	ListView,
	Navigator,
	TouchableHighlight,
	TouchableOpacity,
	Alert,
} from 'react-native';

export class PeripheralListView extends Component {


	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
				// bluetoothPeripheral: {},
			connected: false,
			service: false,
			characteristic: false,
			connectedPeripheral: {},
		};

		this.peripherals;

		this.discoverPeripheralNotifiction;
		this.connectedPeripheralNotifiction;

	}

	componentDidMount() {
		this.discoverPeripheralNotifiction = NativeAppEventEmitter.addListener(
			'didDiscoverPeripheral', (peripheral) => {
				if (!this.peripherals) {
					this.peripherals = [peripheral];
				} else {
					this.peripherals.push(peripheral);
				}
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.peripherals),
				});
			}
		);
		// this.connectedPeripheralNotifiction = NativeAppEventEmitter.addListener(
		// 	'didConnectPeripheral', (name) => {
		// 		this.setState({
		// 			connectedPeripheral: name.name,
		// 			connected: true,
		// 		});
		// 		bluetooth.discoverService();
		// 	}
		// )
		// this.didDiscoverServicesNotifiction = NativeAppEventEmitter.addListener(
		// 	'didDiscoverServices', (services) => {
		// 		this.setState({
		// 			dataSource: this.dataSource.cloneWithRows(services),
		// 			service: true,
		// 		});
		// 	}
		// )
	}

	componentWillUnmount() {
		this.discoverPeripheralNotifiction.remove();
		// this.connectedPeripheralNotifiction.remove();
	}

	render() {
		// if (this.state.connected) {
		// 	return (
		// 		<View style={StyleSheet.container}>
		// 			<Text>
		// 				{'\nperipheralID:' + this.state.connectedPeripheral}
		// 			</Text>
		// 		</View>
		// 	)
		// }
		return (
			<ListView
				style={ styles.container }
				dataSource={this.state.dataSource}
				renderRow={this._renderRow.bind(this)}
			/>
		);
	}


	_renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity
				onPress={() => {
					this._connecting(rowData);
				}}
			>
				<View style={styles.text}>
					<Text style={styles.text}>
						{'\nperipheral:  ' + rowData.peripheralName + '\nRSSI:   ' + rowData.peripheralRSSI + '\nUUID:  ' + rowData.peripheralID}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	_connecting(rowData) {
		console.log(rowData.peripheralID);
		bluetooth.connectPeripheral(rowData.peripheralID);
		this.props.navigator.push({
			name: ServiceListView,
			navigator: this.props.navigator,
			// peripheralID: rowData.peripheralID,
		});
	}

}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
		marginTop: 64,
		// height: 100,
		// width: 100,
	},
	text: {
		// borderWidth: 2,
		borderColor: '#FFFFFF',
		// textAlign: center,
	},
})

// var PeripheralListView = new PeripheralListView
// export { PeripheralListView };
