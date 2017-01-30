import React from 'react'

import {User} from '../API.js'

export default class UserView extends React.Component {
    constructor() {
        super();
        this.state = { userData: {} }
    }

    componentDidMount() {
        const userToGet = this.props.user || this.props.params.user || "";

        User.view({username: userToGet})
            .then(r => r.json())
            .then(d => this.setState({userData: d.result}))
            .catch(e => console.debug(e));
    }

    render() {
        return (
            <pre>
                {JSON.stringify(this.state.userData, null, 4)}
            </pre>
        );
    }
}
