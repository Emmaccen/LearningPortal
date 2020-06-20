import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

function Tiles (props) {
    return (
        <div className='titleCard'>
            <div className='backgroundFix tileImage'></div>
            <h5>{props.title.length > 17 ? props.title.toString().slice(0,17).concat('...') : props.title}</h5>
            <p>{props.desc.length > 140 ? props.desc.toString().slice(0,140).concat(' ...') : props.desc}</p>
            <button onClick={props.handleClick}>View</button>
        </div>
    )
}



class Content extends React.Component {

    constructor () {
        super () 
        this.state = {
           content : [],
           isLoggedIn : true
        }
        this.logOutUser = this.logOutUser.bind(this)
    }

    componentDidMount () {
        const db = firebase.firestore()
        let contents = []
        db.collection('contents').get()
        .then(snapShot => {
            snapShot.forEach(doc => {
                contents.push(doc.data())
            })
            this.setState({
                content : contents
            })
        })

        firebase.auth().onAuthStateChanged((user) =>  {
            // console.log(user)
            if (user) {
              // User is signed in.
              var name, email, photoUrl, uid, emailVerified
              console.log(user)
              console.log('user')
              name = user.email;
              email = user.email;
              photoUrl = user.photoURL;
              emailVerified = user.emailVerified;
              uid = user.uid;
              db.collection('students').doc(user.uid).set({
                name,
                profileUrl : photoUrl,
                email,
                uid
            })
              this.setState({ isLoggedIn : true })
            } else {
              // User is signed out.
              this.setState({ isLoggedIn : false })
              this.props.history.push(`/`)
            }
          })

    }
    
    handleClick (id) {
        this.props.history.push(`/Content/Topic/${id}`)
        console.log(id)
    }

    logOutUser () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log('signed out >>')
            this.setState({
                isLogged : false
            })
            this.props.history.push(`/`)
          }).catch(function(error) {
            // An error happened.
            console.log(error)
          });
    }

    render () {

        const content = this.state.content.map(data => {
            // console.log('data >>>', data)
            return (
                <Tiles 
                title = {data.title}
                desc = {data.desc}
                handleClick = {() => this.handleClick(data.uniqueId)}
                key = {data.id}
                />
            )
        })
        return (
            <div className='contentBg backgroundFix'>
                <Header 
                logOutUser = {this.logOutUser}/>
                <div className='container contentWrapper'>
                    {content}
                </div>
            </div>
        )
    }
}

export default Content