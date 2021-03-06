import { Router, Scene, Actions, DefaultRenderer, ActionConst } from 'react-native-router-flux';
import Home from './src/Home';
import Authorize from './src/Authorize';
import Filters from './src/Filters';
import Price from './src/Weight';
import Size from './src/Size';
import Breed from './src/Breed';
import Age from './src/Age';
import Result from './src/Result'
import SideBar from './src/components/SideBar'
import React, { Component } from 'react';
import Drawer from 'react-native-drawer';
import globalVariables from './globals'
import Icon from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';

const styles = {
    drawerStyles : {
        drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 1},
        main: {paddingLeft: 1},
    }
}

export default class App extends Component {

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    menuButton = (props) =>
        <TouchableOpacity onPress={this.openControlPanel}>
            <Icon name='menu' size={30} color={globalVariables.textColor}/>
        </TouchableOpacity>

    render = () =>
        <Drawer
            key="drawer"
            ref={(ref) => this._drawer = ref}
            tapToClose={true}
            openDrawerOffset={0.6} // 20% gap on the right side of drawer
            panCloseMask={0.6}
            closedDrawerOffset={-3}
            styles={styles.drawerStyles}
            tweenHandler={(ratio) => ({
                main: {opacity: (2 - ratio) / 2}
            })}
            content={<SideBar onSignOut={this.closeControlPanel} />}
        >
            <Router>
                <Scene
                    key="root"
                    leftButtonIconStyle = {{ tintColor: globalVariables.navTextColor }}
                    navigationBarStyle={{
                        backgroundColor: globalVariables.muttvilleGold,
                        borderColor: globalVariables.muttvilleGold,
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 0,
                    }}
                    titleStyle={{
                        color: globalVariables.navTextColor,
                        fontWeight: '800',
                    }}
                >

                    <Scene key="Authorize"
                           renderLeftButton={() => null}
                           component={Authorize}
                           title="Please log in" />
                    <Scene key="Home"
                           renderLeftButton={this.menuButton}
                           component={Home} title="Muttville Bible"
                           leftButtonIconStyle = {{ tintColor: globalVariables.navTextColor }}
                    />
                    <Scene key="Filters" component={Filters} title="Filters" />
                    <Scene key="Size" component={Size} title="Size" duration={1}  />
                    <Scene key="Breed" component={Breed} title="Breed" duration={1}  />
                    <Scene key="Weight" component={Price} title="Weight" duration={1}  />
                    <Scene key="Age" component={Age} title="Age" duration={1}  />
                    <Scene key="Result" component={Result} title="Result"  />
                </Scene>
            </Router>
        </Drawer>
}