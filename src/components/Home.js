// 687254159962-ntqg17mivkhrlstmfdjtcti8rrtvda5k.apps.googleusercontent.com
import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'
import { GoogleLogin, GoogleLogout} from 'react-google-login';
import Content from './Content'
{/* <div class="g-signin2" data-onsuccess="onSignIn"></div> */}
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

function LandingPage () {
    return (
        <div className='backgroundFix homeWrapper'>
                <div className='centered jumbotron'>
                    <div className='jumbotronContent'>
                        <h2>Unlock Your Potential</h2>
                        <p>
                        quaerat id reprehenderit natus molestias minus corporis eligendi cum laboriosam ut praesentium sit dignissimos culpa quis ab doloremque!
                        </p>
                    </div>
                    <div className='oauthBox'>
                        <p><span>Login</span> | <span>SignUp</span></p>
                        <form onSubmit={ e => this.handleSubmit(e)}>
                            <label for='mail'>Email</label>
                            <input id='mail' type='email' placeholder='Email'></input>
                            <label for='password'>Password</label>
                            <input id='password' type='password' placeholder='password'></input>
                            <button id='loginButton' type='Submit'>LogIn</button>
                        </form>
                    </div>
                    <Notification />
                </div>
            </div>
    )
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  function  loginUser () {
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
          
        }).catch(function(error) {
            // Handle Errors here.
            handleNotification(error)
            // remove progress animation
            btn.removeAttribute('disabled')
            // ...
          });
        
    }
}

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn : false
        }
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
                {this.state.isLoggedIn ? this.props.history.push(`/Content`) : <LandingPage />}
            </div>
        )
    }
}

export default Home