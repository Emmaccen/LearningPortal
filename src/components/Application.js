// 687254159962-ntqg17mivkhrlstmfdjtcti8rrtvda5k.apps.googleusercontent.com
import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'
import Content from './Content'
import Home from './Home'

import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


  const loginUser = () => {
    let btn = document.getElementById('loginButton')
    let mail = $('#mail').val()
    let password = $('#password').val()
    if(mail === '' || password === '') {
        handleNotification('Please Provide Input')
    }else {
        // notify and restrict clicks while processing
        btn.setAttribute('disabled', 'disabled')
        // show progress animation
        handleNotification('Processing Login ...')
        // authenticate user
        firebase.auth().signInWithEmailAndPassword(mail, password).then(function success() {
            // remove progress animation
            // Seccessfully logged in
            btn.removeAttribute('disabled')
            this.setState({
                isLoggedIn : false
            })
          
        }).catch(function(error) {
            // Handle Errors here.
            handleNotification(error)
            // remove progress animation
            btn.removeAttribute('disabled')
            // ...
          });
        
    }
}

class Application extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn : false
        }
    }

    responseGoogle = (response) => {
        const name = response.profileObj.name
        const url = response.profileObj.imageUrl
        console.log('weiofnwefiowefio wefnweif nwoiefn woeifn weiofnw eofiwne fiowenf owiefnw oiefnwe ofiwnefoiwenf oi')
        console.log(response);
        console.log(response.profileObj.givenName);
        console.log(response.profileObj.imageUrl);
        this.setState({
          name : 'hello world',
          profileUrl : 'some url'
        })
    
      }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) =>  {
            // console.log(user)
            if (user) {
              // User is signed in.
              this.setState({ isLoggedIn : true })
            } else {
              // User is signed out.
              this.setState({ isLoggedIn : false })
            }
          })
 }

    handleSubmit (e) {
        e.preventDefault()
        loginUser()
    }

    render () {        
        return (
            <div>
                <Home 
                    
                />

            </div>
        )
    }
}

export default Application