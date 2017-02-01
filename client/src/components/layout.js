import React from 'react'
import { withRouter } from 'react-router';

import { Toolbar, ToolbarLeft, ToolbarRight, ToolbarTitle } from './toolbar.js'
import {Card, CardTitle, CardText } from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import SessionStore from '../flux/store.js'

import * as Auth from '../Auth.js';

class Layout extends React.Component {

    state = {
        title: document.title,
        user: ""
    };
    observer = null;

    // Match the AppBar title with the document title.
    componentDidMount() {
        this.observer = new MutationObserver((mutations) => {
            console.log("Mutation")
            this.setState({ title: document.title })
        });
        this.observer.observe(document.querySelector('title'),
            { subtree: true, characterData: true });

        SessionStore.on("change", () => {
            this.setState({
                user: SessionStore.getSession().user
            })
        });
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    goLogin = () => {
        this.props.router.replace('/login')
    }

    goRegister = () => {
        this.props.router.replace('/register')
    }

    tabChange = (val, val2) => {
        this.props.router.replace(val)
    }

    menuSelect = (event, val) => {
        this.props.router.replace(val)
    }

    render() {
        const style = {
            backgroundColor: '#00bcd4',
            color: 'white',
            fontWeight: 100,
        }

        return (
            <div>
                <Toolbar style={style}>
                    {Auth.loggedIn() ?
                        [
                            <ToolbarLeft key={1}>
                                <ToolbarTitle>BoilerBooks</ToolbarTitle>
                                <div style={{ width: 400, float: 'left' }}>
                                    <Tabs style={style} tabItemContainerStyle={{height: 56}} onChange={this.tabChange} value={this.props.location.pathname}>
                                        <Tab label="Dashboard" value="/dashboard" />
                                        <Tab label="Purchases" value="/purchases" />
                                        <Tab label="Income" value="/income" />
                                        <Tab label="Budget" value="/budget" />
                                    </Tabs>
                                </div>
                            </ToolbarLeft>,
                            <ToolbarRight key={2}>
                                <IconMenu
                                    style={{height: '56px'}}
                                    iconStyle={{color: "white", height: "32px"}}
                                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    onChange={this.menuSelect}
                                >
                                    <MenuItem primaryText="Profile" value="/me"/>
                                    <MenuItem primaryText="Logout" value="/logout"/>
                                </IconMenu>
                            </ToolbarRight>
                    ] : [
                            <ToolbarLeft key={1}>
                                <ToolbarTitle>BoilerBooks</ToolbarTitle>
                            </ToolbarLeft>,
                            <ToolbarRight key={2}>
                                <FlatButton label="Register" onClick={this.goRegister} style={style}/>
                                <FlatButton label="Login" onClick={this.goLogin} style={style}/>
                            </ToolbarRight>

                    ]}
                </Toolbar>
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

export default withRouter(Layout);
