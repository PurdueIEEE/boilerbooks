import React from 'react'

export default class Dashboard extends React.Component {

    componentDidMount() {
        document.title = "Dashboard"
    }

    render() {
        return (
            <p>Welcome logged in person!</p>
        );
    }
}
