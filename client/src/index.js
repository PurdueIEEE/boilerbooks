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
import Logout from './components/logout.js';
import Dashboard from './components/dashboard.js';

// MaterialUI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// This is the entry-point of the App; routing and global state is
// saved here and broken down into components below.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {loggedIn: false}

        this.requireAuth = this.requireAuth.bind(this);
        this.goToDash = this.goToDash.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        this.setState({
            loggedIn: cookie.load("BOILERBOOKS-JWT") != undefined
        })
    }

    componentDidMount() {
        document.title = "BoilerBooks";
    }

    requireAuth(nextState, replace) {
        if (!this.state.loggedIn) {
            replace('/login')
        }
    }

    goToDash(nextState, replace) {
        if (this.state.loggedIn) {
            replace('/dashboard')
        }
    }

    logout(nextState, replace) {
        cookie.remove("BOILERBOOKS-JWT")
        this.setState({loggedIn: false})
        replace('/')
    }

    // Routing stuff.
    render() {
        return (
            <Router history={browserHistory}>
                <Route component={Layout} onEnter={this.requireAuth}>
                    <Route path="/dashboard" component={Dashboard}></Route>
                    <Route path="/me" component={Me}></Route>
                    <Route path="/user/:user" component={UserView}></Route>
                </Route>
                <Route path="/" component={Layout} onEnter={this.goToDash}>
                    <IndexRoute component={Home}></IndexRoute>
                    <Route path="/login" component={Login}></Route>
                </Route>
                <Route path="/logout" onEnter={this.logout}></Route>
            </Router>
        )
    }
}

// Required FIX for MaterialUI.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// This mounts our App to the root div in the HTML.
ReactDOM.render(<App />, document.getElementById('root'));
