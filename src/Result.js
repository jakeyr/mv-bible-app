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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import globalVariables from '../globals'

const moment = require('moment');

const {width, height} = Dimensions.get('window');

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
        fontWeight:'800',
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
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        // shadowColor: 'black',
        // shadowOffset: { height: 2, width: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'center',
    },
    commentContainer: {
        padding: 10,
    },
    commentText: {
        color: globalVariables.textColorLight,
        fontSize: 14,
        fontWeight: '400',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex:1,
    },
    commentHeader : {
        fontSize: 16,
        color: globalVariables.textColor,
        fontWeight: '800',
        paddingBottom: 5,
    },
    infoText: {
        color: globalVariables.textColor,
        fontSize: 14,
        fontWeight: '200',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
    },
    itemAttributes : {
        flex:1,
        // flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfoText1: {
        fontSize: 25,
        fontWeight: '300',
        marginLeft: 5,
        marginRight: 5,
        color: "#f5b600",
        flex: 1,
        textAlign: 'center',
    },
    itemInfoText2: {
        fontSize: 12,
        fontWeight: '400',
        marginLeft: 5,
        marginRight: 5,
        color: "#f5b600",
        flex: 1,
    },
    iconBox: {
        flex:1,
        paddingLeft:20,
        paddingRight:20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fffcef"
    },
    iconRow : {
        flex:1,
        flexDirection:'row',
        marginTop: 10,
        marginBottom:10
    },
    separator: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 15,
    }
});

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
        Actions.refresh({title: this.props.hit.name})
    }

    render() {
        hit = this.props.hit;
        return <View style={styles.maincontainer}>
            <InstantSearch
                appId="R80XXCZCBX"
                apiKey={this.props.searchKey}
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
                        {hit.images
                            ? hit.images.map((image) => <CarouselImage image={image} key={image} maxHeight={500}/>)
                            : <CarouselImage image={globalVariables.placeHolderImage} key="placeholder" maxHeight={500}/>
                        }
                    </Swiper>
                    <View style={styles.infoContainer}>
                        <Text style={styles.itemName} numberOfLines={1}>{hit.name} ({hit.arn})</Text>
                    </View>
                    <View style={styles.iconBox}>
                        <View style={styles.iconRow}>
                            <InfoIcon key="size" icon="paw" text1={hit.size} />
                            <InfoIcon icon={"gender-" + hit.gender.toLowerCase()} text1={hit.gender} />
                        </View>
                        <View style={styles.iconRow}>
                            <InfoIcon key="weight" icon="scale-balance" text1={hit.weight} text2="pounds" />
                            <InfoIcon key="age" icon="clock" text1={hit.age} text2="years old" />
                        </View>
                    </View>
                    <View style={{marginTop: 5}}>
                        {hit.comments
                            ? (hit.comments.map((comment,index) =>
                                <View key={"container"+index}>
                                    <Comment comment={comment} key={"comment"+index} style={styles.commentContainer} />
                                    {index !== (hit.comments.length - 1) ? <View style={styles.separator} /> : <View/>}
                                </View>))
                            : <View style={styles.commentContainer}><Text>No Comments</Text></View>}
                    </View>
                </ScrollView>
            </InstantSearch>
        </View>
    }
}

const Comment = (props) =>
    <View style={styles.commentContainer}>
        <Text style={styles.commentHeader}>{props.comment.author} ({moment(props.comment.time * 1000).fromNow()})</Text>
        <Text style={styles.commentText}>{props.comment.comment.trim()}</Text>
    </View>

const InfoIcon = (props) =>
    <View style={styles.itemAttributes} key={props.icon}>
        <Icon name={props.icon} size={35} color="#f5b600" />
        <Text style={styles.itemInfoText1}>{props.text1 ? props.text1 : "?"} </Text>
        <Text style={styles.itemInfoText2}>{props.text2}</Text>
    </View>


Result.propTypes = {
    searchState: PropTypes.object,
    hit: PropTypes.object,
};

export default Result;