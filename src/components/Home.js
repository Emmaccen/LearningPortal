// 687254159962-ntqg17mivkhrlstmfdjtcti8rrtvda5k.apps.googleusercontent.com
import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'
import Content from './Content'
// import { GoogleLogin, GoogleLogout} from 'react-google-login';
import GoogleLogin from 'react-google-login';

const responseGoogle = (response) => {
  console.log(response);
}

{/* <div class="g-signin2" data-onsuccess="onSignIn"></div> */}

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

function LandingPage (props) {
    const btnStyle = props.isNewUser ? {
        backgroundColor : 'blue'
    } : {}
    
    const currentTab = props.isNewUser ? {
        color : 'blue',
    } : {}
const logBtn = props.isOldUser ? {
    color : 'orange',
} : {}
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
                        <p><span style={logBtn}  onClick={() => props.handleTab('1')}>Login</span> | <span onClick={() => props.handleTab('2')} style={currentTab}>SignUp</span></p>
                        <form onSubmit={props.isNewUser ? event =>  props.createNewUser(event) : e =>  props.loginUser(e)}>
                            <label for='mail'>Email</label>
                            <input id='mail' type='email' placeholder='Email'></input>
                            <label for='password'>Password</label>
                            <input id='password' type='password' placeholder='password'></input>
                            <button style={btnStyle} id='loginButton' type='Submit'>{props.isOldUser ? 'Login' : 'SignUp'}</button>
                        </form>
                    </div>
                    <Notification />
                </div>
            </div>
    )
}

  

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn : false,
            isNewUser : false,
            isOldUser : true
        }

        this.loginUser = this.loginUser.bind(this)
        this.handleTab = this.handleTab.bind(this)
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
handleTab(tab) {
    tab === '1' ? this.setState({
        isNewUser : false,
        isOldUser : true
    }) :
    this.setState({
        isNewUser : true,
        isOldUser : false
    })
}

createNewUser(e) {
      e.preventDefault()
      let btn = document.getElementById('loginButton')
      let mail = $('#mail').val()
      let password = $('#password').val()
      if(mail === '' || password === '') {
          handleNotification('Please Provide Input')
      }else {
          // notify and restrict clicks while processing
          btn.setAttribute('disabled', 'disabled')
          // show progress animation
          handleNotification('Processing Account Creation ...')
          // authenticate user
          firebase.auth().createUserWithEmailAndPassword(mail, password).then( success => {
              btn.removeAttribute('disabled')
              console.log(success.user)
              this.setState({
                  isLoggedIn : true
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

 loginUser (e) {
     e.preventDefault()
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
        firebase.auth().signInWithEmailAndPassword(mail, password).then( success => {
            // remove progress animation
            // Seccessfully logged in
            btn.removeAttribute('disabled')
            this.setState({
                isLoggedIn : true
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
    render () {

        return (
            <div>
                
                {this.state.isLoggedIn ? this.props.history.push(`/Content`) : <LandingPage 
                loginUser = {this.loginUser}
                isNewUser = {this.state.isNewUser}
                isOldUser = {this.state.isOldUser} 
                handleTab = {this.handleTab}
                createNewUser = {this.createNewUser}/>}
            </div>
        )
    }
}

export default Home