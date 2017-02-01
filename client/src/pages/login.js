import React from 'react';
import { withRouter } from 'react-router';

import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import { Flex, withReflex } from 'reflexbox'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as Auth from '../Auth.js';

const inputSubmitStyle = {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
}

const PaperFlex = withReflex()(Paper)

class Login extends React.Component {
    state = {
        username: "",
        password: "",
        errorText: ""
    }

    componentDidMount() {
        document.title = "Login"
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});

        if (this.state.errorText) {
            this.setState({errorText: ""})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        Auth.login(this.state.username, this.state.password)
            .then(res => {
                if (res['error'] !== undefined) {
                    this.setState({
                        errorText: `Error: ${res['error']}`
                    })
                }
                else if (res['result']){
                    this.props.router.replace('/dashboard')
                }
            })
            .catch(err => {
                console.warn("Error with auth request", err)
                this.setState({
                    errorText: "Error: Please try again"
                })
            })
    }

    render() {
        return (
            <Flex justify='space-around' align='center'>
                <PaperFlex flexColumn={true} justify='center' align='center' p={2} zDepth={3} col={4}>
                    <h1>Please log in.</h1>
                    <form action="" onSubmit={this.handleSubmit}>
                        <TextField
                            hintText="Username"
                            floatingLabelText="Username"
                            style={{width: '100%'}}
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                        <br />
                        <TextField
                            hintText="Password"
                            floatingLabelText="Password"
                            type="password"
                            style={{width: '100%'}}
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <br /> <br />
                        <RaisedButton
                            label="Login"
                            primary={true}
                            className="submit"
                            style={{width: '100%'}}
                            onClick={this.handleSubmit}>
                            <input type="submit" style={inputSubmitStyle}/>
                        </RaisedButton>
                    </form>
                    <Snackbar
                        open={this.state.errorText !== ""}
                        message={this.state.errorText}
                        autoHideDuration={2000}
                    />
                </PaperFlex>
            </Flex>
        );
    }
}

export default withRouter(Login);
