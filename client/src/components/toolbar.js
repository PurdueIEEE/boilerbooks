import React from 'react'


export class Toolbar extends React.Component {
    render() {
        const style = {
            width: '100%',
            height: 56,
            display: "flex",
            justifyContent: "space-between",
            ...this.props.style
        }

        return (
            <div style={style}>
                <div style={{display: "flex", padding: '0 24px', width: "100%"}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export class ToolbarLeft extends React.Component {
    render() {
        const style = {
            width: "100%",
            float: 'left',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            ...this.props.style
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}
export class ToolbarRight extends React.Component {
    render() {
        const style = {
            width: "100%",
            float: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            ...this.props.style,
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

export class ToolbarTitle extends React.Component {
    render() {
        let style = {
            height: 56,
            lineHeight: '56px',
            fontSize: '22px',
            paddingRight: '24px',
            ...this.props.style
        }

        if (this.props.NoPadding) {
            style.paddingRight = '0'
        }


        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

//{Auth.loggedIn() ? (
    //<ToolbarGroup lastChild={true} style={style}>
        //<ToolbarTitle text={this.state.user} style={titleStyle}/>
        //<ToolbarSeparator />
        //<FlatButton label="Logout" onClick={this.goLogout} style={style}/>
    //</ToolbarGroup>
//) : (
    //<ToolbarGroup lastChild={true} style={style}>
        //<FlatButton label="Login"  onClick={this.goLogin} style={style}/>
    //</ToolbarGroup>
//)}
