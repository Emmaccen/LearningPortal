import React from 'react'
import $ from 'jquery'
// import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'
import { useHistory } from "react-router-dom";
import Home from './Home'



const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Header extends React.Component {

    constructor (props) {

        super (props) 
        this.state = {
            name : '',
            profileUrl : '',
            email : '',
            uid : ''
        }
        
    }

    componentDidMount () {

        var name, email, photoUrl, uid, emailVerified;

        firebase.auth().onAuthStateChanged((isLogged) =>  {
            // console.log(isLogged)
            if (isLogged) {
              // User is signed in.
              var user = firebase.auth().currentUser;
              console.log(user)
              console.log('user')
              name = user.displayName;
              email = user.email;
              photoUrl = user.photoURL;
              emailVerified = user.emailVerified;
              uid = user.uid;
              this.setState({
                  name,
                  profileUrl : photoUrl,
                  email,
                  uid
              })
              console.log(user)

            } else {
              // User is signed out.
              
            }
          })
    }

    render () {
        console.log('form header ', this.state)
        return (
            <div>
                <div className='header'>
                    <img src='/Logo.svg' alt='Company Logo' ></img>
                    <div>
                    <p>{this.state.name}</p>
                        <div onClick={this.props.logOutUser} className='backgroundFix profileImage'></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header