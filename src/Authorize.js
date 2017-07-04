import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';

import {Actions, ActionConst} from 'react-native-router-flux';
import Login from 'react-native-simple-login';
import globalVariables from '../globals'

const { height,width } = Dimensions.get('window');

const barSize = Platform.select({ios: 63, android: 50});

const styles = StyleSheet.create({
    loadingView : {
        flex: 1,
        marginTop: barSize,
        marginBottom: barSize,
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorText1: {
        // width: width,
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: '200',
    },
    indicatorText2: {
        // width: width,
        paddingBottom: 20,
    },
});


class Authorize extends Component {
    static displayName = 'Login page';

    constructor(props) {
        super(props);
        this._onLogin = this._onLogin.bind(this);
        this._onResetPassword = this._onResetPassword.bind(this);
        this.state = {
            isLoading: false
        };
    }

    _onLogin(email, password) {

        var that = this;

        console.log("login started", globalVariables.authUrl, email, password);

        fetch(globalVariables.authUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                l: email,
                p: password,
            })
        })
        .then((response) => response.json())
        .then(function(response) {
            console.log("response from server", response);
            AsyncStorage.setItem(globalVariables.tokenKey, response.token)
                .then(function () {
                    console.info("setting up token in storage ", response.token);
                    that.props.postLogin();
                    that.setState({isLoading: false});
                    Actions.Home({searchKey: response.token, type: ActionConst.REPLACE});
                })
                .catch((error) => {
                    console.warn(error);
                })
                .done();
        })
        .catch((error) => {
            console.info(error);
            this.setState({isLoading: false});
        });
        this.setState({isLoading: true})
    };

    _onResetPassword(email) {
        console.log(email);
    }

    render() {
        console.log("checking authorization status");

        // if we've already got a token, don't need login screen.
        // skip straight to the mutts!!
        //
        AsyncStorage.getItem(globalVariables.tokenKey)
        .then((value) => {
            console.log("token from storage:", value, globalVariables.requireLogin && value);
            if (value || globalVariables.skipLogin) {
                console.log("found token in storage, skipping to app!");
                this.props.postLogin();
                Actions.Home({searchKey: value, type: ActionConst.REPLACE});
             }
        });

        if (this.state.isLoading) {
            return (
                <View style={styles.loadingView}>
                    <Text style={styles.indicatorText1} >Contacting Petpoint</Text>
                    <Text style={styles.indicatorText2} >Let&rsquo;s get to those mutts!</Text>
                    <ActivityIndicator size="large" animating={true} />
                </View>
            );
        } else {
            return (
                <View style={{height: height}}>
                    <Text>Please log in with PetPoint...</Text>
                    <Login
                        labels={{userIdentification: 'PetPoint user name'}}
                        userIdentificationInputIcon={{uri: "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/user-128.png"}}
                        onLogin={this._onLogin}
                        onResetPassword={this._onResetPassword}
                        autoCapitalize="none"
                    />
                </View>
            );
        }
    }
};

export default Authorize;