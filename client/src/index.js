/*
This file will contain the main client SPA page routing.
*/

// React + BoilerBooks
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Authenticate, User, Organization, Income, Budget, Rights, Purchase } from './API.js';
import cookie from 'react-cookie'

import './index.css';

import Layout from './components/layout.js';
import Me from './components/me.js';
import UserView from './components/user.js';
import Home from './components/home.js';
import Login from './components/login.js';

// MaterialUI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// This is the entry-point of the App; routing and global state is
// saved here and broken down into components below.
class App extends React.Component {
    constructor(props) {
        super(props);

        const jwt = cookie.load("BOILERBOOKS-JWT")

        this.state = {
            loggedIn: jwt !== undefined
        }
    }

    componentWillMount() {
        Authenticate.authenticate({
            username: 'mmolo',
            password: 'password-hello2'
        },
        (res) => {
            if (res.body['result']) {
                console.log("logged in!")
                this.setState({loggedIn: true})
            }
        },
        (error) => {
            this.setState({loggedIn: false})
        })
    }

    componentDidMount() {
        document.title = "BoilerBooks";
    }

    // Routing stuff.
    render() {
        let authorizedRoutes = (
            <Route path="/" component={Layout}>
                    <IndexRoute component={Home}></IndexRoute>
                    <Route path="/me" component={Me}></Route>
                    <Route path="/user/:user" component={UserView}></Route>
                    <Route path="/login" component={Login}></Route>
            </Route>
        )

        let unAuthorizedRoutes = (
            <Route path="/*" component={Layout}>
                <IndexRoute component={Login}></IndexRoute>
            </Route>
        )

        console.log(this.state.loggedIn)
        let routes = this.state.loggedIn ? authorizedRoutes : unAuthorizedRoutes;

        return (
            <Router history={browserHistory}>
                {routes}
            </Router>
        )
    }
}

// Required FIX for MaterialUI.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// This mounts our App to the root div in the HTML.
ReactDOM.render(<App />, document.getElementById('root'));
