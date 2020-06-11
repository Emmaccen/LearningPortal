import React from 'react'
import $ from 'jquery'
// import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

class Header extends React.Component {

    constructor () {
        super () 
        this.state = {}
    }

    render () {
        return (
            <div>
                <div className='header'>
                    <img src='/Logo.svg' alt='Company Logo' ></img>
                    <span className='profileImage icon icon-profile-male'></span>
                </div>
            </div>
        )
    }
}

export default Header