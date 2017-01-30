/*
This file will contain the main client SPA page routing.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexLink, Link } from 'react-router';
import {Authenticate} from './API.js';
import './index.css';

// This is the entry-point of the App; routing and global state is
// saved here and broken down into components below.
class App extends React.Component {
    constructor(props) {
        super(props);

        // Restore state from local storage if we can.
        if (localStorage.state != null) {
            this.state = JSON.parse(localStorage.state);
        } else {
            this.state = { 'auth_token': null };
        }
    }

    componentDidMount() {

        fetch('https://google.com/').then(function(response) {
          console.log("fetch done");
        }).catch(function(err) {
          console.log("fetch fail");
        });
    }

    // When our state is modified, cache it to local storage.
    componentDidUpdate(prevProps, prevState) {
        localStorage.state = JSON.stringify(this.state);
    }

    // Routing stuff.
    render() {
        return (
                <Router>
                    <Route path="/" component={MainPage}>
                        <IndexRoute component={Home}/>
                        <Route path="stuff" component={Stuff} />
                        <Route path="contact" component={Contact} />
                    </Route>
                </Router>
                );
    }
}

class MainPage extends React.Component {
    render() {
        return (
                <div>
                    <h1>BoilerBooks</h1>
                    <ul className="header">
                    <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                    <li><Link to="/stuff" activeClassName="active">Stuff</Link></li>
                    <li><Link to="/contact" activeClassName="active">Contact</Link></li>
                    </ul>

                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
                );
    }
}

class Home extends React.Component {

    componentDidMount() {
        console.log("Entering Home...");
    }

    componentWillUnmount() {
        console.log("Leaving Home...");
    }

    render() {
        return (
                <p>Home!</p>
                );
    }
}

class Stuff extends React.Component {

    componentDidMount() {
        console.log("Entering Stuff...");
    }

    componentWillUnmount() {
        console.log("Leaving Stuff...");
    }

    render() {
        return (
                <p>Stuff!</p>
                );
    }
}

class Contact extends React.Component {

    componentDidMount() {
        console.log("Entering Contact...");
    }

    componentWillUnmount() {
        console.log("Leaving Contact...");
    }

    render() {
        return (
                <p>Contact!</p>
                );
    }
}

// This mounts our App to the root div in the HTML.
ReactDOM.render(<App />, document.getElementById('root'));
