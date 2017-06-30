import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Login from 'react-native-simple-login';
import globalVariables from '../globals'
import PropTypes from "react-native";

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    maincontainer: {
        ...Platform.select({
            ios: {
                marginTop: 63,
            },
            android: { marginTop: 50 },
        }),
        flex: 1,
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
            // .then(function(response) { console.info(response); return response})
            // .then((response) => Actions['root'].refresh({searchKey : token}))
            .then((response) => Actions['Home']({searchKey : response.token}))
            .then((response) => this.setState({isLoading: false}))
            .catch((error) => {
                console.log(error);
                this.setState({isLoading: false});
            });

        this.setState({isLoading: true})
    };

    _onResetPassword(email) {
        console.log(email);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{height: height}}>
                    <ActivityIndicator animating={true}>
                        <Text>Hold on to yer butts please...</Text>
                    </ActivityIndicator>
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

Authorize.propTypes = {
    // callback : PropTypes.func,
}

export default Authorize;