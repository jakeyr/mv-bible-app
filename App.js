import { Router, Scene } from 'react-native-router-flux';
import Home from './src/Home';
import Authorize from './src/Authorize';
import Filters from './src/Filters';
import Price from './src/Weight';
import Size from './src/Size';
import Breed from './src/Breed';
import Age from './src/Age';
import Result from './src/Result'
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

export default class App extends Component {
    render() {

        var searchKey = this.getOnboard().done();

        return <Router>
            <Scene
                key="root"
                navigationBarStyle={{
                    backgroundColor: '#162331',
                    borderColor: '#162331',
                    borderBottomColor: 'transparent',
                }}
                titleStyle={{ color: 'white' }}
            >
                <Scene key="Authorize" component={Authorize} title="Please log in"  />
                <Scene key="Home" component={Home} title="Muttville Bible" searchKey={searchKey} />
                <Scene key="Filters" component={Filters} title="Filters" searchKey={searchKey} />
                <Scene key="Size" component={Size} title="Size" duration={1} searchKey={searchKey} />
                <Scene key="Breed" component={Breed} title="Breed" duration={1} searchKey={searchKey} />
                <Scene key="Weight" component={Price} title="Weight" duration={1} searchKey={searchKey} />
                <Scene key="Age" component={Age} title="Age" duration={1} searchKey={searchKey} />
                <Scene key="Result" component={Result} title="Result" searchKey={searchKey} />
            </Scene>
        </Router>
    }

    async getOnboard() {
        const onboard = await AsyncStorage.getItem('@auth:token');
        return onboard;
    }
}
