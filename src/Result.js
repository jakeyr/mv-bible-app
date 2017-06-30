import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    Platform,
} from 'react-native';

import Swiper from 'react-native-swiper'
import { InstantSearch } from 'react-instantsearch/native';
import { Actions } from 'react-native-router-flux';
import CarouselImage from './components/CarouselImage';
import Dimensions from 'Dimensions';

const moment = require('moment');

const {width, height} = Dimensions.get('window');

const globalVariables = {
    textColor: "black",
}

const styles = StyleSheet.create({
    carousel: {
        // width,
        // height: 500,
    },
    closeText : {

    },
    container : {
        height : height,
    },
    itemName : {
        fontWeight:'200',
        fontSize: 25,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center'
    },
    boxContainer : {

    },
    boxValue : {
        flex: 1,
        fontSize: 19,
        fontWeight: '200',
        color: globalVariables.textColor,
        textAlign: 'center'
    },
    boxLabel : {
        flex: 1,
        fontSize: 12,
        color: globalVariables.textColor,
        textAlign: 'center'
    },
    infoContainer: {
        // flex: 1,
        // flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        shadowColor: 'black',
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        alignContent: 'center',
        marginBottom: 5,
    },
    commentContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10,
        shadowColor: 'black',
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    commentText: {
        color: globalVariables.textColor,
        fontSize: 14,
        fontWeight: '200',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'left',
    },
    infoText: {
        color: globalVariables.textColor,
        fontSize: 14,
        fontWeight: '200',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
    },
});

const Box = () =>
    <View style={styles.boxContainer}>
        <Text style={styles.boxValue}>{this.props.value}</Text>
        <Text style={styles.boxLabel}>{this.props.label}</Text>
    </View>

class Result extends Component {

    static displayName = 'React Native example';

    constructor(props) {
        super(props);
        this.onSearchStateChange = this.onSearchStateChange.bind(this);
        this.state = {
            searchState: this.props.searchState ? this.props.searchState : {},
        };
    }

    onSearchStateChange(nextState) {
        this.setState({ searchState: { ...this.state.searchState, ...nextState } });
    }

    componentWillMount() {
        // set the title to the name of the doggo
        //
        Actions.refresh({title: this.props.hit.name})
    }

    render() {
        hit = this.props.hit;

        weightStr = (hit.weight ? hit.weight : "?") + " lbs";
        ageStr    = (hit.age ? hit.age : "?") + " years old";

        return <View style={styles.maincontainer}>
            <InstantSearch
                appId="R80XXCZCBX"
                apiKey="0f7ec5636fe0da292cf1870fc82d6516"
                indexName="active-mutts"
                searchState={this.state.searchState}
                onSearchStateChange={this.onSearchStateChange}
            >
                <ScrollView
                    key={hit.id}
                    scrollsToTop={true}
                    style={styles.container}
                    contentInset={{top: (Platform.OS !== 'ios' ? 54 : 64), left: 0, bottom: 0, right: 0}}
                    contentOffset={{x: 0, y: -(Platform.OS !== 'ios' ? 54 : 64)}}
                >
                    <StatusBar backgroundColor="blue" barStyle="light-content"/>
                    <Swiper activeDotStyle={{backgroundColor: 'white'}} height={500} horizontal={true}>
                        {hit.images.map((image) =>
                            <CarouselImage image={image} key={image} maxHeight={500}/>
                        )}
                    </Swiper>
                    <View style={styles.infoContainer}>
                        <Text style={styles.itemName} numberOfLines={1}>{hit.name}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText} numberOfLines={1}>{hit.breed} &#8226; {weightStr} &#8226; {ageStr}</Text>
                    </View>
                    {hit.comments.map((comment,index) =>
                        <View style={styles.commentContainer} key={index}>
                            <Text style={styles.commentHeader}>{comment.author} ({moment(comment.time*1000).fromNow()})</Text>
                            <Text style={styles.commentText}>{comment.comment}</Text>
                        </View>
                    )}
                </ScrollView>
            </InstantSearch>
        </View>
    }
}

Result.propTypes = {
    searchState: PropTypes.object,
    hit: PropTypes.object,
};

export default Result;