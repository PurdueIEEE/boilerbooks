/*
This file will contain the main client SPA page routing.
*/

// React + BoilerBooks
import React from 'react';
import ReactDOM from 'react-dom';
import { Locations, Location, Environment } from 'react-router-component';
import { Authenticate, User, Organization, Income, Budget, Rights, Purchase } from './API.js';

// MaterialUI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <FontIcon className="material-icons">favorite</FontIcon>;

// This is the entry-point of the App; routing and global state is
// saved here and broken down into components below.
class App extends React.Component {
    constructor(props) {
        super(props);

        // Restore state from local storage if we can.
        if (localStorage.state != null) {
            this.state = JSON.parse(localStorage.state);
        } else {
            this.state = { 'auth_token': null, selectedPage: 0 };
        }
    }

    componentDidMount() {
        document.title = "BoilerBooks";
        Authenticate.authenticate({username: "master", password: "poop"})
        .then(r => console.debug(r, r.json()))
        .catch(e => console.debug(e));
    }

    // When our state is modified, cache it to local storage.
    componentDidUpdate(prevProps, prevState) {
        localStorage.state = JSON.stringify(this.state);
    }

    select(index) {
        switch (index) {
        case 0: Environment.defaultEnvironment.navigate('/');
        case 1: Environment.defaultEnvironment.navigate('/users/abc');
        case 2: Environment.defaultEnvironment.navigate('/contact');
        }

        var s = this.state;
        s.selectedPage = index;
        this.setState(s);
    }

    // Routing stuff.
    render() {
        return (
        <MuiThemeProvider>
            <div>
                <AppBar title="BoilerBooks" iconClassNameRight="muidocs-icon-navigation-expand-more" />
                <Locations>
                    <Location path="/" handler={MainPage} />
                    <Location path="/users/:username" handler={UserPage} />
                    <Location path="/contact" handler={ContactPage} />
                </Locations>
                <Paper zDepth={1}>
                    <BottomNavigation selectedIndex={this.state.selectedPage}>
                        <BottomNavigationItem
                            label="Recents"
                            icon={recentsIcon}
                            onTouchTap={() => this.select(0)}
                            />
                        <BottomNavigationItem
                            label="Favorites"
                            icon={favoritesIcon}
                            onTouchTap={() => this.select(1)}
                            />
                        <BottomNavigationItem
                            label="Nearby"
                            icon={nearbyIcon}
                            onTouchTap={() => this.select(2)}
                            />
                    </BottomNavigation>
                </Paper>
            </div>
        </MuiThemeProvider>
                );
    }
}

class MainPage extends React.Component {
    componentDidMount() {
        document.title = "Main";
    }
    render() {
        return (
                <p>Main</p>
                );
    }
}

class UserPage extends React.Component {
    componentDidMount() {
        document.title = "User";
    }
    render() {
        return (
                <p>User</p>
                );
    }
}

class FriendsPage extends React.Component {
    componentDidMount() {
        document.title = "Friends";
    }
    render() {
        return (
                <p>Friends</p>
                );
    }
}

class ContactPage extends React.Component {
    componentDidMount() {
        document.title = "Contact";
    }
    render() {
        return (
                <p>Contact</p>
                );
    }
}

// Required FIX for MaterialUI.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// This mounts our App to the root div in the HTML.
ReactDOM.render(<App />, document.getElementById('root'));
