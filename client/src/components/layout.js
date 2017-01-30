import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import {Card, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import cookie from 'react-cookie'

export default class Layout extends React.Component {
    // Routing stuff.
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="BoilerBooks"
                        iconClassNameLeft="muidocs-icon-navigation-expand-more"
                        iconElementRight={
                            cookie.load("BOILERBOOKS-JWT") != undefined ?
                                ( <FlatButton label="Logout" href="/logout" />)
                              : ( <FlatButton label="Login" href="/login" />)
                        }
                    />
                    <Card className="content">
                        <CardTitle title={this.props.location.pathname} />
                        <CardText>
                            <div>
                                {this.props.children}
                            </div>
                        </CardText>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}
