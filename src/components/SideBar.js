import React from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    Alert,
    AsyncStorage,
    Linking
} from 'react-native';

import {Actions,ActionConst} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import globalVariables from '../../globals';

const { height } = Dimensions.get('window');

const styles = {
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    buttonText : {
        marginLeft: 15,
        fontWeight:'800',
        fontSize:18,
        color:globalVariables.textColor
    },
    logoutButtonContainer: {
        borderTopColor: globalVariables.textColorLight,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingTop:10,
    },
}

export default SideBar = (props) => <View
    style={{
        backgroundColor: globalVariables.muttvilleGold,
        height: height,
        paddingTop: 50,
        paddingLeft: 15,
    }}
>
    <MenuRow
        onPress={() => Linking.openURL("mailto:jake@muttville.org")}
        text="HELP"
        icon="help-with-circle"
        containerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
    />
    <View style={{
        width: 125,
        height: height - 125,
        justifyContent: "flex-end",
    }}>
        { props.loggedIn()
            ? <MenuRow
                onPress={() => alertButton(props)}
                icon="log-out"
                text="LOGOUT"
                textStyle={{marginLeft: 15, fontWeight:'800',fontSize:18,color:globalVariables.textColor}}
                containerStyle={styles.logoutButtonContainer}
              />
            : <View/> }
    </View>
</View>

const alertButton = (props) =>
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

const MenuRow = (props) =>
    <TouchableOpacity onPress={props.onPress} >
        <View style={props.containerStyle}>
            <Icon name={props.icon} size={25} color={globalVariables.textColor} />
            <Text style={props.textStyle}>{props.text}</Text>
        </View>
    </TouchableOpacity>
