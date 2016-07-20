import React, { Component } from 'react';
import {
    ListView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

class ServiceListView extends Component {
    constructor(props) {
        super(props);
        this.state({
            dataSource: new ListView.dataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        });
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

    _renderService() {
        return({
            <TouchableOpacity onPress={() => this._pressDiscriptionCell()}>
                <View style={styles.discriptionCell}>
                    <Text>
                        Service
                    </Text>
                </View>
            </TouchableOpacity>
        });
    }

    _pressDiscriptionCell() {
        console.log('_pressDiscriptionCell');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    discriptionCell: {
        flex: 1,
        backgroundColor: '#892810',
    },
})
