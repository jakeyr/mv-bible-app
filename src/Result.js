import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Linking,
} from 'react-native';

import Swiper from 'react-native-swiper'
import { InstantSearch } from 'react-instantsearch/native';
import { Actions } from 'react-native-router-flux';
import CarouselImage from './components/CarouselImage';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import PhotoView from 'react-native-photo-view'

import globalVariables from '../globals'

const moment = require('moment');

const {width, height} = Dimensions.get('window');

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();


const metaStyles = {
    center : {
        textAlign:'center',
        color: globalVariables.textColor
    },
};

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
        textAlign: 'center',
        color: globalVariables.textColor,
    },
    itemBreed : {
        fontWeight:'600',
        color: globalVariables.textColorLight,
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
    nameContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10,
        // shadowColor: 'black',
        // shadowOffset: { height: 2, width: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'center',
        backgroundColor: "#fffcef",
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
        paddingBottom:15,
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
        textAlign: 'center',
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
    },
    stage : {
        ...metaStyles.center,
        fontWeight: '800',
        fontSize: 16,
    },
    location : {
        ...metaStyles.center,
        fontSize:16,
        fontWeight:'600'
    },
    locationPrefix : {
        ...metaStyles.center,
        fontSize:16,
        fontWeight:'300'
    },
    fosterName : {
        ...metaStyles.center,
        fontWeight: '600',
        paddingBottom: 5,
    },
    fosterPhone : {
        ...metaStyles.center,
        color: "#5a86ff",
        paddingBottom: 5,
    },
    fosterEmail : {
        ...metaStyles.center,
        color: "#5a86ff",
        paddingBottom: 5,
    },
    fosterSeparator : {
        borderBottomWidth:1,
        borderColor:'#dddddd',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 15,
        marginBottom: 15,
    },
    wrapper: {
        backgroundColor: '#000',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    photo: {
        width,
        height,
        flex: 1
    },
});

const DOUBLE_PRESS_DELAY = 200;

class Result extends Component {

    static displayName = 'Result page';

    constructor(props) {
        super(props);
        this.onSearchStateChange = this.onSearchStateChange.bind(this);
        this.state = {
            searchState: this.props.searchState ? this.props.searchState : {},
            showViewer: false,
            showIndex: 0
        }
    }

    doublePressWrap = (key,func) => {
        return (e) => {
            const now = new Date().getTime();
            const keyStr = "lastPress" + key;
            if (this[keyStr] && (now - this[keyStr]) < DOUBLE_PRESS_DELAY) {
                delete this[keyStr];
                func(e);
            }
            else {
                this[keyStr] = now;
            }
        }
    }

    viewerPressHandle = () => {
        this.setState({
            showViewer: false
        })
    }

    thumbPressHandle = (i) => {
        this.setState({
            showIndex: i,
            showViewer: true
        })
    }

    onSearchStateChange(nextState) {
        this.setState({ searchState: { ...this.state.searchState, ...nextState } });
    }

    componentWillMount() {
        // set the title to the name of the doggo
        Actions.refresh({title: this.props.hit.name})
    }

    _generateDialString = (phoneStr) =>
        phoneUtil.format(phoneUtil.parse(phoneStr, 'US'),PNF.RFC3966)

    render() {
        let hit = this.props.hit;
        let si  = hit['structured-info'];

        if (this.state.showViewer){
            return <View style={{position: 'relative'}}>
                <Viewer
                    index={this.state.showIndex}
                    pressHandle={this.doublePressWrap("viewer",this.viewerPressHandle)}
                    imgList={hit.images}
                />
            </View>
        }

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
                    <Swiper activeDotStyle={{backgroundColor: globalVariables.muttvilleGold}} height={500} horizontal={true}>
                        {hit.images
                            ? hit.images.map((image,i) =>
                                <TouchableWithoutFeedback key={i} onPress={e => this.doublePressWrap("thumb",this.thumbPressHandle)(i)}>
                                    <View><CarouselImage image={image} key={image} maxHeight={500}/></View>
                                </TouchableWithoutFeedback>)
                            : <CarouselImage image={globalVariables.placeHolderImage} key="placeholder" maxHeight={500}/>
                        }
                    </Swiper>
                    <View style={styles.nameContainer}>
                        <Text style={styles.itemName} numberOfLines={1}>{hit.name} ({hit.arn})</Text>
                        <Text style={styles.itemBreed} numberOfLines={1}>{si.primary_breed}</Text>
                    </View>
                    <View style={{flex:1,padding:15,justifyContent:'center'}}>
                        <Text style={styles.stage}>{si.stage}</Text>
                        <View style={styles.fosterSeparator}/>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end',marginBottom:5}}>
                            <Text style={styles.locationPrefix}>Currently at</Text>
                            <Text style={styles.location}> {si.location}</Text>
                        </View>
                        {si.foster_person_first_name
                            ? <View>
                                <Text style={styles.fosterName}>{si.foster_person_first_name} {si.foster_person_last_name}</Text>
                                <TouchableOpacity
                                    onPress={()=>
                                        Linking.openURL(this._generateDialString(si.foster_person_phone_primary))
                                            .catch(err => console.info('An error occurred', err))}
                                >
                                    <Text style={styles.fosterPhone}>{si.foster_person_phone_primary}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>
                                        Linking.openURL(`mailto:${si.foster_person_email_primary}`)
                                            .catch(err => console.info('An error occurred', err))}
                                >
                                    <Text style={styles.fosterEmail}>{si.foster_person_email_primary}</Text>
                                </TouchableOpacity>
                              </View>
                            : <View/>}
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
        <Text style={styles.commentHeader}>{props.comment.type} ({moment(props.comment.time * 1000).fromNow()})</Text>
        <Text style={styles.commentText}>{props.comment.comment.trim()}</Text>
    </View>

const InfoIcon = (props) =>
    <View style={styles.itemAttributes} key={props.icon}>
        {props.entypo
            ? <EntypoIcon name={props.icon} size={35} color="#f5b600" />
            : <Icon name={props.icon} size={35} color="#f5b600" />}
        <Text style={styles.itemInfoText1}>{props.text1 ? props.text1 : "?"} </Text>
        <Text style={styles.itemInfoText2}>{props.text2}</Text>
    </View>

const renderPagination = (index, total, context) => {
    return (
        <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            top: 125,
            left: 0,
            right: 0
        }}>
            <View style={{
                borderRadius: 7,
                backgroundColor: 'rgba(255,255,255,.15)',
                padding: 3,
                paddingHorizontal: 7
            }}>
                <Text style={{
                    color: '#fff',
                    fontSize: 14
                }}>{index + 1} / {total}</Text>
            </View>
        </View>
    )
}

const Viewer = props => {
    console.log(props);
    return <Swiper index={props.index} style={styles.wrapper} renderPagination={renderPagination}>
        {props.imgList.map((item, i) =>
            <View key={i} style={styles.slide}>
                <PhotoView
                    {...props}
                    onTap={props.pressHandle}
                    source={{uri: item}}
                    resizeMode='contain'
                    minimumZoomScale={0.5}
                    maximumZoomScale={3}
                    androidScaleType='center'
                    style={styles.photo}/>
            </View>
        )}
    </Swiper>
}

Result.propTypes = {
    searchState: PropTypes.object,
    hit: PropTypes.object,
};

export default Result;