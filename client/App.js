var { Router,
    Route,
    IndexRoute,
    IndexLink,
    Link } = ReactRouter;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: [], text: ''};
    }

    componentDidMount() {
        fetch('https://google.com/').then(function(response) {
          console.log("fetch done");
        }).catch(function(err) {
          console.log("fetch fail");
        });
    }

    render() {
        return (
                <Router>
                    <Route path="/" component={MainPage}>
                        <IndexRoute component={Home}/>
                        <Route path="stuff" component={Stuff} />
                        <Route path="contact" component={Contact} />
                    </Route>
                </Router>
                );
    }
}

class MainPage extends React.Component {
    render() {
        return (
                <div>
                    <h1>BoilerBooks</h1>
                    <ul className="header">
                    <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                    <li><Link to="/stuff" activeClassName="active">Stuff</Link></li>
                    <li><Link to="/contact" activeClassName="active">Contact</Link></li>
                    </ul>

                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
                );
    }
}

class Home extends React.Component {

    componentDidMount() {
        console.log("Entering Home...");
    }

    componentWillUnmount() {
        console.log("Leaving Home...");
    }

    render() {
        return (
                <p>Home!</p>
                );
    }
}

class Stuff extends React.Component {

    componentDidMount() {
        console.log("Entering Stuff...");
    }

    componentWillUnmount() {
        console.log("Leaving Stuff...");
    }

    render() {
        return (
                <p>Stuff!</p>
                );
    }
}

class Contact extends React.Component {

    componentDidMount() {
        console.log("Entering Contact...");
    }

    componentWillUnmount() {
        console.log("Leaving Contact...");
    }

    render() {
        return (
                <p>Contact!</p>
                );
    }
}

// Root
ReactDOM.render(<App />, document.getElementById('root'));
