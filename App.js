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

const globalVariables = {
    authUrl : 'https://localhost:5000/petpoint-auth',
}

export default class App extends Component {

    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.state = {
            searchKey: ''
        }
    }

    onLogin(token) {
        this.setState({
            searchKey : token
        });
    }

    render() {
        return (
            <Router>
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
                    <Scene key="Home" component={Home} title="Muttville Bible"/>
                    <Scene key="Filters" component={Filters} title="Filters" />
                    <Scene key="Size" component={Size} title="Size" />
                    <Scene key="Breed" component={Breed} title="Breed" duration={1} />
                    <Scene key="Weight" component={Price} title="Weight" duration={1} />
                    <Scene key="Age" component={Age} title="Age" duration={1} />
                    <Scene key="Result" component={Result} title="Result" />
                </Scene>
            </Router>
        );
    }
}
