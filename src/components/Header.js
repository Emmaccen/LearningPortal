import React from 'react'
import $ from 'jquery'
// import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

class Header extends React.Component {

    constructor (props) {
        console.log('header props >', props)
        super (props) 
        this.state = {}
    }

    

    render () {
        return (
            <div>
                <div className='header'>
                    <img src='/Logo.svg' alt='Company Logo' ></img>
                    <div>
                        {/* <p></p> */}
                        <div onClick={() => this.logOutUser} className='backgroundFix profileImage'></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header