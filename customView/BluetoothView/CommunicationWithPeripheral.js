import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
} from 'react-native';

export class CommunicationWithPeripheral extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={ styles.container}>
                <Text>
                    {'在当前视图不能滚动的前提下指定这个属性，可以决定当手指移开多远距离之后，只要视图不能滚动，你可以来回多次这样的操作。确保你传入一个常量来减少内存分配。'}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BACDEF',
    },
});
