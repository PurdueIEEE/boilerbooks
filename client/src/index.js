// React + BoilerBooks
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import './index.css';

import Layout from './components/layout.js';

import Me from './pages/me.js';
import UserView from './components/user.js';
import Home from './pages/home.js';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Dashboard from './pages/dashboard.js';

import * as Auth from './Auth.js';

// MaterialUI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
    state = {}

    requireAuth = (nextState, replace) => {
        if (!Auth.loggedIn()) {
            replace('/login')
        }
    }

    goToDash = (nextState, replace) => {
        if (Auth.loggedIn()) {
            replace('/dashboard')
        }
    }

    logout = (nextState, replace) => {
        Auth.logout()
        replace('/')
    }

    // Routing stuff.
    render() {
        return (
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <Route path="/" component={Layout} onEnter={this.goToDash}>
                        <IndexRoute component={Home}></IndexRoute>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/register" component={Register}></Route>
                    </Route>

                    <Route path="/logout" onEnter={this.logout}></Route>

                    <Route component={Layout} onEnter={this.requireAuth}>
                        <Route path="/dashboard" component={Dashboard}></Route>
                        <Route path="/purchases" component={Dashboard}></Route>
                        <Route path="/income" component={Dashboard}></Route>
                        <Route path="/budget" component={Dashboard}></Route>

                        <Route path="/me" component={Me}></Route>
                        <Route path="/user/:user" component={UserView}></Route>
                    </Route>
                </Router>
            </MuiThemeProvider>
        )
    }
}

// Required FIX for MaterialUI.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// This mounts our App to the root div in the HTML.
ReactDOM.render(<App />, document.getElementById('root'));
