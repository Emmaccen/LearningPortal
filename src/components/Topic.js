import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


function Vids (props) {
    return(
        <div onClick={()=> props.handleClick(props)} className='sideLinks'>
            <video src={props.url}></video>
            <div>
                <h6>{props.title}</h6>
                <p>{props.desc}</p>
            </div>
        </div>
    )
}
function Docs (props) {
    return(
        <div onClick={() => props.handleDocClick(props)} className='sideLinks'>
            <div className='backgroundFix docsImage' controls></div>
            <div>
                <h6>{props.title}</h6>
                <p>{props.instruction}</p>
            </div>
        </div>
    )
}



class Topic extends React.Component {

    constructor (props) {
        super (props)
        this.state = {
            isVideo : true,
            currentVideoId : '',
            currentTitle : '',
            currentTitleDesc : '',
            currentVideoSrc : '',
            currentVideTitle : '',
            currentVideoDesc : '',
            videos : [{title : '', url : '', desc : ''}],
            deliverables : [
                {deliverables : {date : '',id : '', instruction : '', point : '', title : ''}}
            ],
            currentDocTitle : '',
            CurrentDocInstruction : '',
            currentDocPoints : '',
            CurrentDocDate : '',
            currentDocId : ''
        }

        this.handleClick = this.handleClick.bind(this)
        this.VidDisplay = this.VidDisplay.bind(this)
        this.DocDisplay = this.DocDisplay.bind(this)
    }

    componentDidMount () {
        const db = firebase.firestore()
        let id = this.props.match.params.id
        let vidList = []
        let documentList = []
        db.collection('contents').doc(id).get()
        .then(result => {
            this.setState({
                currentTitle : result.data().title,
                currentTitleDesc : result.data().desc
            })
        })
        db.collection('videos').doc(id).collection(id).get()
        .then(result => {
            result.forEach(video => {
                vidList.push(video.data())
                // console.log(video.data().url)
            })
            this.setState({
                currentVideTitle : vidList[0].title,
                currentVideoDesc : vidList[0].description,
                currentVideoSrc : vidList[0].url,
                videos : vidList
            })
            
        })
        db.collection('deliverables').doc(id).collection(id).get()
        .then(documents => {
            documents.forEach(doc => {
                documentList.push(doc.data())
            })
            this.setState({
                deliverables : documentList
            })
        })
    }

    VidDisplay () {
        return (
            <div className='vidPlayer'>
                {/* https://firebasestorage.googleapis.com/v0/b/devlookup.appspot.com/o/bD2IkGhy98uux5MDNa5j%2FAsphalt%209_%20Legends%20upload.mp4?alt=media&token=31f84de5-174e-424f-ab74-3fe79afc1aca */}
                <video src={this.state.currentVideoSrc} controls></video>
                <h3>{this.state.currentVideTitle}</h3>
                <p>{this.state.currentVideoDesc}</p>
                <button>Hide Description</button>
            </div>
        )
    }
    DocDisplay () {
        return (
            <div className='deliverablesContainer'>
                <div className='docHeader'>
                    <h1>{this.state.currentDocTitle}</h1>
                    <h3>{this.state.currentDocPoints}</h3>
                </div>
                <div>
                    <p>{this.state.CurrentDocDate}</p>
                    <p>{this.state.CurrentDocInstruction}</p>
                    <button>Hide Description</button>
                </div>
                <div className='centered'>
                    <div className='card'>
                        <div className='submissionHeader'>
                            <h5>Your Work</h5>
                            <p>Assigned</p>
                        </div>
                        <div className='workUpload'>
                            <button><span className='icon icon-upload'></span>Add Or Create</button>
                            <button>Mark As Done</button>
                        </div>
                    </div>
                    <div className='card'>
                        <img alt='profileImage'></img>
                        <textarea></textarea>
                    </div>
                </div>
            </div>
        )
    }
    
    
    handleClick (props) {
        console.log(props)
        this.setState({
            isVideo : true,
            currentVideTitle : props.title,
            currentVideoDesc : props.description,
            currentVideoSrc : props.url
        })
    }

    handleDocClick (props) {
        console.log(props)
        this.setState({
            isVideo : false,
            currentDocTitle : props.title,
            CurrentDocInstruction : props.instruction,
            currentDocPoints : props.point,
            CurrentDocDate : props.date,
            currentDocId : props.id
        })
    }
    render () {

        const videos = this.state.videos.map(vids => {
            return (
                < Vids 
                url = {vids.url}
                title = {vids.title}
                desc = {vids.desc}
                handleClick = {()=> this.handleClick(vids)}
                />
            )
        })
        
        const documents = this.state.deliverables.map(docs => {
            return (
                < Docs 
                title = {docs.deliverables.title}
                instruction = {docs.deliverables.instruction}
                handleDocClick = {() => this.handleDocClick(docs.deliverables)}
                />
            )
        })

        return (
            <div className='topicWrapper'>
               <h2>{this.state.currentTitle}</h2>
               <p>{this.state.currentTitleDesc}</p>
               <button>Hide description</button>
               <div className='playerSection'>
                    {this.state.isVideo ? <this.VidDisplay/> : <this.DocDisplay />}
                    <div className='sideContent'>
                        {/* <div className='sideNavigation'>
                            <div className='navs'>
                                <span onClick={''} className='icon icon-insert-template'></span>
                                <span onClick={''} className='icon icon-insert-template'></span>
                            </div>
                        </div> */}
                       {videos}
                       {documents}
                    </div>
                    <div>
                        <div className='container commentSection'>
                                <p>6,9302 Comments</p>
                                <div className='commentInput'>
                                    <img alt='user Image'></img>
                                    <textarea></textarea>
                                </div>
                                <div className='comments'>
                                    <img></img>
                                    <p>some lazy comments in the comment section haha ! :) </p>
                                </div>
                        </div>
                    </div>
               </div>
            </div>
        )
    }
}

export default Topic