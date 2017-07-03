import { Router, Scene, Actions, DefaultRenderer, ActionConst } from 'react-native-router-flux';
import Home from './src/Home';
import Authorize from './src/Authorize';
import Filters from './src/Filters';
import Price from './src/Weight';
import Size from './src/Size';
import Breed from './src/Breed';
import Age from './src/Age';
import Result from './src/Result'
import React, { Component } from 'react';
import Drawer from 'react-native-drawer';
import globalVariables from './globals'
import Icon from 'react-native-vector-icons/Entypo';

import {
    Dimensions,
    Text,
    Alert,
    View,
    Button,
    AsyncStorage,
    Linking,
    TouchableHighlight
} from 'react-native';

const { height } = Dimensions.get('window');

const styles = {
    drawerStyles : {
        drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
        main: {paddingLeft: 3},
    }
}


const SideBar = (props) => <View
    style={{
        backgroundColor: globalVariables.muttvilleGold,
        height: height,
        paddingTop: 50,
        paddingLeft: 15,
    }}
>
    <TouchableHighlight onPress={() => Linking.openURL("mailto:jake@muttville.org")} >
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Icon name="help-with-circle" size={25} color="black" />
            <Text style={{marginLeft: 15, fontWeight:'800',fontSize:18}}>HELP</Text>
        </View>
    </TouchableHighlight>
    <View style={{
        width: 125,
        height: height - 125,
        justifyContent: "flex-end",
    }}>
        { props.loggedIn() ? <SignOut onSignOut={props.onSignOut} /> : <View/> }
    </View>
</View>

const SignOut = (props) => <TouchableHighlight
    style={{
        borderTopColor: "black",
        borderTopWidth: 1,
    }}
    onPress={() => {
        Alert.alert(
            'Sign out',
            'Are you sure you want to sign out?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'Sign Out', onPress: () => {
                    console.log('OK Pressed')
                    AsyncStorage.removeItem(globalVariables.tokenKey);
                    props.onSignOut();
                    Actions.Authorize({type: ActionConst.REPLACE});
                }
                },

            ],
            {cancelable: false}
        )
    }} >
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <Icon name="log-out" size={25} color="black" />
        <Text style={{marginLeft: 15, fontWeight:'800',fontSize:18}}>LOGOUT</Text>
    </View>
</TouchableHighlight>


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn : false,
        }
    }

    postLogin = () => {
        this.setState({loggedIn: true});
    }

    postLogout = () => {
        this.setState({loggedIn: false});
        this.closeControlPanel();
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    render() {
        return <Drawer
            ref={(ref) => this._drawer = ref}
            tapToClose={true}
            openDrawerOffset={0.6} // 20% gap on the right side of drawer
            panCloseMask={0.6}
            closedDrawerOffset={-3}
            styles={styles.drawerStyles}
            tweenHandler={(ratio) => ({
                main: {opacity: (2 - ratio) / 2}
            })}
            content={<SideBar loggedIn={() => this.state.loggedIn} onSignOut={this.postLogout} />}
        >
            <Router>
                <Scene
                    key="root"
                    navigationBarStyle={{
                        backgroundColor: globalVariables.muttvilleGold,
                        borderColor: globalVariables.muttvilleGold,
                        borderBottomColor: 'transparent',
                    }}
                    titleStyle={{
                        color: 'black',
                        fontWeight: '800',
                        // fontFamily : 'comicsans',
                    }}
                    leftButtonIconStyle = {{ tintColor:'black'}}
                >
                    <Scene key="Authorize" component={Authorize} title="Please log in" postLogin={this.postLogin} />
                    <Scene key="Home" component={Home} title="Muttville Bible" />
                    <Scene key="Filters" component={Filters} title="Filters"  />
                    <Scene key="Size" component={Size} title="Size" duration={1}  />
                    <Scene key="Breed" component={Breed} title="Breed" duration={1}  />
                    <Scene key="Weight" component={Price} title="Weight" duration={1}  />
                    <Scene key="Age" component={Age} title="Age" duration={1}  />
                    <Scene key="Result" component={Result} title="Result"  />
                </Scene>
            </Router>
        </Drawer>

    }
}