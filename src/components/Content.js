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
        <div>
            <div className='backgroundFix tileImage'></div>
            <p onClick={props.handleClick}>{props.title}</p>
        </div>
    )
}


class Content extends React.Component {

    constructor () {
        super () 
        this.state = {
           content : []
        }
    }

    componentDidMount () {
        const db = firebase.firestore()
        let contents = []
        db.collection('contents').get()
        .then(snapShot => {
            snapShot.forEach(doc => {
                contents.push({
                    title : doc.data().title,
                    id : doc.id
                })
            })
            this.setState({
                content : contents
            })
        })

    }
    
    handleClick (id) {
        this.props.history.push(`/Content/Topic/${id}`)
        console.log(id)
    }


    render () {

        const content = this.state.content.map(data => {
            console.log('data >>>', data)
            return (
                <Tiles 
                title = {data.title}
                handleClick = {() => this.handleClick(data.id)}
                key = {data.id}
                />
            )
        })
        return (
            <div>
                <Header />
                <div className='container contentWrapper'>
                    {content}
                </div>
            </div>
        )
    }
}

export default Content