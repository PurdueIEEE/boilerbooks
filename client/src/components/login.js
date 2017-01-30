import React from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {Authenticate} from '../API.js';


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

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            errorText: "",
            submitting: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (this.state.errorText) {
            this.setState({errorText: ""})
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        Authenticate.authenticate({username: this.state.username, password: this.state.password})
            .then(r => r.json())
            .then(d => {
                if (d['error']) {
                    this.setState({errorText: d['error']})
                }
                else if (d['result']){
                    window.location = '/'
                }
            })
            .catch(e => console.log(e));
    }

    render() {
        return (
            <div className="login">
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
                    <RaisedButton label="Login" primary={true} className="submit">
                        <input type="submit" style={inputSubmitStyle}/>
                    </RaisedButton>
                </form>
                <br />
                <div className="error">
                    {this.state.errorText}
                </div>
            </div>
        );
    }
}
