import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

class CarouselImage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{
                        height: this.props.maxHeight,
                        resizeMode: 'cover',
                    }}
                    source={{uri: this.props.image}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        // borderColor: 'red',
        // borderWidth: 1
    },
});

export default CarouselImage;