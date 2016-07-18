import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	ListView,
} from 'react-native';

class PeripheralListView extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSource: new ListView.DataSource(
	  	{
	  		rowHasChanged: (row1, row2) => row1 !== row2,
	  	}),
	  	// peripheralList: undefine,
	  };
	}

	componentDidMount() {

	}

	fetchData() {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(),
		})
	}

	render() {
		<View style={}>
			<ListView 
				dataSource={ this.state.dataSource }
				renderRow={ this.renderPeripheral }
			/>
		</view>
	}

	renderPeripheral(peripheral) {
		<View style={}>
			<Text style={} > </Text>
		</View>
	}
}