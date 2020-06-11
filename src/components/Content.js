import React from 'react'
import $ from 'jquery'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Content extends React.Component {

    constructor () {
        super () 
        this.state = {}
    }

    render () {
        return (
            <div>
                hello
            </div>
        )
    }
}

export default Content