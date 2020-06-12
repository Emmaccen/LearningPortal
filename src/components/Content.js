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
           content : []
        }
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
                desc = {data.desc}
                handleClick = {() => this.handleClick(data.uniqueId)}
                key = {data.id}
                />
            )
        })
        return (
            <div className='contentBg backgroundFix'>
                <Header />
                <div className='container contentWrapper'>
                    {content}
                </div>
            </div>
        )
    }
}

export default Content