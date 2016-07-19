import React, { Component } from 'react';
var { NativeAppEventEmitter } = require('react-native');
import {
	View,
	Text,
	StyleSheet,
	ListView,
	Navigator,
	TouchableHighlight,
} from 'react-native';

export class PeripheralListView extends Component {


	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) =>row1!==row2,
				// bluetoothPeripheral: {},
			}),
		};
		this.discoverPeripheralDeviceNotifiction ;

	}



	componentDidMount() {
		this.discoverPeripheralDeviceNotifiction = NativeAppEventEmitter.addListener(
		  'discoverPeripheral', (per) => {
			//   this.state.bluetoothPeripheral.push(per)
			console.log(per);
			var perarr = [per];
			console.log(perarr);
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
	}

	componentWillUnmount() {
		this.discoverPeripheralDeviceNotifiction.remove();
	}

	render() {
		return (
			<ListView
				style={ styles.container }
				dataSource={this.state.dataSource}
				renderRow={this._renderRow}
				>
			</ListView>
		)
	}

	_renderRow(peripheral) {
		return (
			<TouchableHighlight >
				<Text>
					ListViewRow renderRow. {peripheral.peripheralName + 'RSSI' + peripheral.peripheralRSSI + '   ' + peripheral.peripheralID}
				</Text>
			</TouchableHighlight>
		)
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
		// textAlign: center,
	},
})

// var PeripheralListView = new PeripheralListView
// export { PeripheralListView };
