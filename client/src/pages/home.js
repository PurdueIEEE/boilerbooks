import React from 'react'

export default class Home extends React.Component {

    componentDidMount() {
        document.title = "Welcome"
    }

    render() {
        return (
            <p>Welcome!</p>
        );
    }
}
