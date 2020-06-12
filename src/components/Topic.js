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
    let desc = props.desc + ''
    return(
        <div onClick={()=> props.handleClick(props)} className='sideLinks'>
            <video src={props.url}></video>
            <div>
                <h6>{props.title.length > 17 ? props.title.toString().slice(0,17).concat('...') : props.title}</h6>
                <p>{desc.length > 50 ? desc.toString().slice(0,50).concat(' ...') : desc}</p>
            </div>
        </div>
    )
}
function Docs (props) {
    return(
        <div onClick={() => props.handleDocClick(props)} className='sideLinks'>
            <div className='backgroundFix docsImage' controls></div>
            <div>
                <h6>{props.title.length > 17 ? props.title.toString().slice(0,17).concat('...') : props.title}</h6>
                <p>{props.instruction.length > 50 ? props.instruction.toString().slice(0,50).concat(' ...') : props.instruction}</p>
            </div>
        </div>
    )
}
function Comments (props) {
    return (
        <div className='comments'>
            <div className='accImg backgroundFix'></div>
            <div className='commentDetails'>
                <h5>{props.time}</h5>
                <p>{props.comment}</p>
            </div>
        </div>
    )
}


class Topic extends React.Component {

    constructor (props) {
        super (props)
        this.state = {
            onScreen : '',
            isVideo : true,
            currentVideo : {title : '', uniqueId : '', url : '', description : ''},
            videos : [{title : '', url : '', desc : ''}],
            deliverables : [{date : '',id : '', instruction : '', point : '', title : ''}],
            currentDoc : {date: "",id: "",instruction: "", point: "", title: "",uniqueId: ""},
            comments : [{time : '', comment : ''}],
            totalComments : 0
        }

        this.handleClick = this.handleClick.bind(this)
        this.VidDisplay = this.VidDisplay.bind(this)
        this.DocDisplay = this.DocDisplay.bind(this)
    }

    componentDidMount () {
        const db = firebase.firestore()
        let id = this.props.match.params.id
        let vidList = []
        let commentList = []
        let documentList = []
        let totalComments = 0
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
            })
            this.setState({
                currentVideo : vidList[0],
                videos : vidList,
                onScreen : 'video'
            })
            db.collection('videos').doc(id).collection(id).doc(vidList[0].uniqueId).collection('comments')
            .get().then(comments => {
                comments.forEach(comment => {
                    commentList.push(comment.data())
                    totalComments ++
                })
                this.setState({
                    comments : commentList.reverse(),
                    totalComments : totalComments
                })
            })
            
        })
        db.collection('deliverables').doc(id).collection(id).get()
        .then(documents => {
            documents.forEach(doc => {
                documentList.push(doc.data().deliverables)
                console.log(doc.data().deliverables)
            })
            this.setState({
                currentDoc : documentList[0],
                deliverables : documentList
            })
        })
    }

    VidDisplay () {
        return (
            <div className='vidPlayer'>
                <video src={this.state.currentVideo.url} controls></video>
                <h3>{this.state.currentVideo.title}</h3>
                <p>{this.state.currentVideo.description}</p>
                <button>Hide Description</button>
            </div>
        )
    }
    DocDisplay () {
        return (
            <div className='deliverablesContainer'>
                <div className='docHeader'>
                    <h1>{this.state.currentDoc.title}</h1>
                    <h3>{this.state.currentDoc.point} Points</h3>
                </div>
                <div>
                    <p>Due Date : {this.state.currentDoc.date}</p>
                    <p>Instructions : {this.state.currentDoc.instruction}</p>
                    <button>Hide Description</button>
                </div>
                <div className='submissionWrapper centered'>
                    <div className='card'>
                        <div className='submissionHeader'>
                            <h5>Your Work</h5>
                            <p>Assigned</p>
                        </div>
                        <div className='workUpload'>
                            <span className='icon icon-upload'>Add Or Create</span>
                            <button>Mark As Done</button>
                        </div>
                    </div>
                    <div className='card submissionComment'>
                        <div className='accImg backgroundFix'></div>
                        <input placeholder='Private Comment ...' id='privateComment'></input>
                        <div className='alignBase'>
                            <span className='icon icon-share'></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    
    handleClick (props) {
        console.log(props)
        const db = firebase.firestore()
        const commentList = []
        let totalComments = 0
        let id = this.props.match.params.id
        db.collection('videos').doc(id).collection(id).doc(props.uniqueId).collection('comments')
            .get().then(comments => {
                comments.forEach(comment => {
                    commentList.push(comment.data())
                    totalComments ++
                })
                this.setState({
                    totalComments : totalComments,
                    comments : commentList.reverse(),
                    isVideo : true,
                    currentVideo : {title : props.title, uniqueId : props.uniqueId, url : props.url, description : props.description},
                    onScreen : 'video'
                })
            })
    }

    handleDocClick (props) {
        console.log(props)
        const db = firebase.firestore()
        const commentList = []
        let totalComments = 0
        let id = this.props.match.params.id
        db.collection('deliverables').doc(id).collection(id).doc(props.uniqueId).collection('comments')
            .get().then(comments => {
                comments.forEach(comment => {
                    commentList.push(comment.data())
                    totalComments ++
                })
                this.setState({
                    totalComments : totalComments,
                    comments : commentList.reverse(),
                    isVideo : false,            
                    currentDoc : { 
                        date: props.date, id: props.id,instruction: props.instruction, 
                        point: props.point, title: props.title,uniqueId: props.uniqueId
                    },
                    onScreen : 'document'
                })
            })
    }

    handleComment () {
        const db = firebase.firestore()
        let id = this.props.match.params.id
        let message = $('#commentMessage').val()
        if(this.state.isVideo && message+ '' !== ''){
            console.log(this.state.currentVideo)
            let current = this.state.currentVideo
            db.collection('videos').doc(id).collection(id).doc(current.uniqueId)
            .collection('comments').doc(new Date().toString()).set({
                comment : message,
                time : new Date().toLocaleString()
            }).then(()=> {
                handleNotification('Comment Added')
                $('#commentMessage').val('')
            })

        }else if(!this.state.isVideo && message+ '' !== '') {
            let current = this.state.currentDoc
            db.collection('deliverables').doc(id).collection(id).doc(current.uniqueId)
            .collection('comments').doc(new Date().toString()).set({
                comment : message,
                time : new Date().toLocaleString()
            }).then(()=> {handleNotification('Comment Added')})
        }else if( message+ '' === '') {
            handleNotification('Comment Cannot Be Empty :(')
        }
    }

    render () {

        const videos = this.state.videos.map(vids => {
            return (
                < Vids 
                url = {vids.url}
                title = {vids.title}
                desc = {vids.description}
                handleClick = {()=> this.handleClick(vids)}
                />
            )
        })
        
        const documents = this.state.deliverables.map(docs => {
            return (
                < Docs 
                title = {docs.title}
                instruction = {docs.instruction}
                handleDocClick = {() => this.handleDocClick(docs)}
                />
            )
        })

        const comments = this.state.comments.map(comment => {
            return <Comments
            comment = {comment.comment}
            time = {comment.time}
            />
        })

        return (
                    <div className='topicPage backgroundFix'>
                        <div className='topicWrapper'>
                            <div className='currentCourse'>
                                <h2>{this.state.currentTitle}</h2>
                                <p>{this.state.currentTitleDesc}</p>
                                <button>Hide Description</button>
                            </div>
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
                                        <div className='commentSection'>
                                                <hr></hr>
                                                <p>{this.state.totalComments} Comments</p>
                                                <div className='commentInput'>
                                                    <div className='accImg backgroundFix'></div>
                                                    <input placeholder='Add Comment ...' id='commentMessage'></input>
                                                    <div className='alignBase'>
                                                        <span className='icon icon-share' onClick={() => this.handleComment()}></span>
                                                    </div>
                                                </div>
                                        </div>
                                        <div>
                                            {comments}
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <Notification />
                    </div>
        )
    }
}

export default Topic