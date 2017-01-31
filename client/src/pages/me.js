import React from 'react'
import UserView from '../components/user.js'
import CertUpload from '../components/certupload.js'

class Me extends React.Component {
    render() {
        return (
            <div>
                <UserView user="mmolo" />
                <p>Upload a new certificate:</p>
                <CertUpload user="mmolo" style={{width: '100%', height: 100}}/>
            </div>
        );
    }
}

export default Me;
