import React from 'react'

import AppBar from 'material-ui/AppBar'
import {Card, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import * as Auth from '../Auth.js';

export default class Layout extends React.Component {

    state = {title: document.title};
    observer = null;

    // Match the AppBar title with the document title.
    componentDidMount() {
        this.observer = new MutationObserver((mutations) => {
            console.log("Mutation")
            this.setState({ title: document.title })
        });
        this.observer.observe(document.querySelector('title'),
            { subtree: true, characterData: true });
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    render() {
        return (
            <div>
                <AppBar
                    title="BoilerBooks"
                    iconElementLeft={<span />}
                    iconElementRight={
                        Auth.loggedIn() ?
                          ( <FlatButton label="Logout" href="/logout" />)
                        : ( <FlatButton label="Login" href="/login"   />)
                    }
                />
                <Card className="content">
                    <CardTitle title={this.state.title} />
                    <CardText>
                        <div>
                            {this.props.children}
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
