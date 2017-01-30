import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import {Card, CardTitle, CardText } from 'material-ui/Card';

export default class Layout extends React.Component {
    // Routing stuff.
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar title="BoilerBooks" iconClassNameRight="muidocs-icon-navigation-expand-more" />
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
