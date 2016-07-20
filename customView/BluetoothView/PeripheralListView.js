import React, { Component } from 'react';
var bluetooth = require('react-native').NativeModules.ConnetionWithBlueTooth;
var { NativeAppEventEmitter } = require('react-native');
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
				rowHasChanged: (row1, row2) =>row1!==row2,
				// bluetoothPeripheral: {},
				connected: false,
				service: false,
				characteristic: false,
				connectedPeripheral: {},
			}),
		};
		this.discoverPeripheralDeviceNotifiction;
		this.connectedPeripheralNotifiction;

	}



	componentDidMount() {
		this.discoverPeripheralDeviceNotifiction = NativeAppEventEmitter.addListener(
			'discoverPeripheral', (per) => {
			//   this.state.bluetoothPeripheral.push(per)
			// console.log(per);
				var perarr = [per];
			// console.log(perarr);
				if (!this.bluetoothPeripheral) {
					this.bluetoothPeripheral = [per];
				} else {
					this.bluetoothPeripheral.push(per);
				}
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(this.bluetoothPeripheral),
				});
			}
		);
		this.connectedPeripheralNotifiction = NativeAppEventEmitter.addListener(
			'didConnectPeripheral', (name) => {
				this.setState({
					connectedPeripheral: name.name,
					connected: true,
				});
				bluetooth.discoverService();
			}
		)
		this.didDiscoverServicesNotifiction = NativeAppEventEmitter.addListener(
			'didDiscoverServices', (services) => {
				this.setState({
					dataSource: this.dataSource.cloneWithRows(services),
					service: true,
				});
			}
		)
	}

	componentWillUnmount() {
		this.discoverPeripheralDeviceNotifiction.remove();
		this.connectedPeripheralNotifiction.remove();
	}

	render() {
		if (this.state.connected) {
			return (
				<View style={StyleSheet.container}>
					<Text>
						{'\nperipheralID:' + this.state.connectedPeripheral}
					</Text>
				</View>
			)
		}
		return (
			<ListView
				style={ styles.container }
				dataSource={this.state.dataSource}
				renderRow={this._renderRow.bind(this)}
				>
			</ListView>
		);
	}

	connecting(rowData) {
		console.log(rowData.peripheralID);
		bluetooth.connectPeripheral(rowData.peripheralID);

	}

	_renderRow(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity
				onPress={() => {
					this.connecting(rowData);
				}}
			>
				<View style={styles.container}>
					<Text style={styles.text}>
						{'\nperipheral:  ' + rowData.peripheralName + '\nRSSI:   ' + rowData.peripheralRSSI + '\nUUID:  ' + rowData.peripheralID}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
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
