import React from 'react'
import $ from 'jquery'
import Header from './Header'
import { firestore } from 'firebase';
import {Notification} from './Notification'
import {handleNotification} from './Notification'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var file = ''

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
              handleNotification('user is signed out !')
              
            }
          })


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

    toggle (event, id) {
        const target = event.target
            $(id).slideToggle( 0, function() {
              // Animation complete.
              $(target).text() === 'Hide Description' ? $(target).text("Show Description") : $(target).text('Hide Description')
            });
    }

    VidDisplay () {
        return (
            <div className='vidPlayer'>
                <video src={this.state.currentVideo.url} controls controlsList='nodownload'></video>
                <h3>{this.state.currentVideo.title}</h3>
                <p id='vidDescToggle'>{this.state.currentVideo.description}</p>
                <button onClick={ e => this.toggle(e,'#vidDescToggle')}>Hide Description</button>
            </div>
        )
    }
    DocDisplay () {
        return (
            <div className='deliverablesContainer'>
                <div className='docHeader'>
                    <h1>{this.state.currentDoc.title}</h1>
                    <h3><span className='icon icon-star-full'></span>
                    {this.state.currentDoc.point} Points</h3>
                </div>
                <div>
                    <p>Due Date : {this.state.currentDoc.date}</p>
                    <p id='vidDescToggle'>Instructions : {this.state.currentDoc.instruction}</p>
                    <button onClick={ e => this.toggle(e,'#vidDescToggle')}>Hide Description</button>
                </div>
                <div className='submissionWrapper centered'>
                    <div className='card'>
                        <div className='submissionHeader'>
                            <h5>Your Work</h5>
                            <p>Assigned</p>
                        </div>
                        <div className='workUpload'>
                        <input onChange={ e => this.handleSubmit(e)} type='file' name="file" id="file" class="inputfile"></input>
                        <label for="file"><span className='icon icon-upload'></span>Add Or Create</label>
                            <button id='markBtn' disabled >Mark As Done</button>
                        </div>
                    </div>
                    <div className='card submissionComment'>
                        <div className='accImg backgroundFix'></div>
                        <input placeholder='Private Comment ...' id='privateComment'></input>
                        <div className='alignBase'>
                            <span id='privateBtn' disabled className='icon icon-share'></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    mark () {
        const button = $('#markBtn')
        const db = firebase.firestore()
        const ref =  db.collection('submissions').doc(this.state.currentDoc.uniqueId)
        .collection('submitted').doc(this.state.uid)
        ref.update({
            completed : true
        }).then( () => {
            handleNotification("Submission Marked As Completed")
            button.text('Completed')
            button.attr('disabled', 'disabled')
            button.css('backgroundColor', 'grey')
        } ).catch(e => {
            handleNotification(e)
        })
    }

    privateComment () {
        const message = $('#privateComment').val()
        const db = firebase.firestore()
        const ref =  db.collection('submissions').doc(this.state.currentDoc.uniqueId)
        .collection('submitted').doc(this.state.uid)
        ref.update({
            privateComment : message
        }).then( () => {
            handleNotification("Comment Updated")
            $('#privateComment').val('')
        } ).catch(e => {
            handleNotification(e)
        })
    }

    handleSubmit (e) {
        e.preventDefault()
        const db = firebase.firestore()
        const storageRef = firebase.storage().ref()
        file = e.target.files[0]

          handleNotification('Processing, Please wait ...')
          // upload submission
            storageRef.child(`${this.state.currentDoc.title}/${file.name}`).put(file).then(() => {
            handleNotification('File Uploaded')
            storageRef.child(`${this.state.currentDoc.title}/${file.name}`).getDownloadURL().then( url => {
            db.collection('submissions').doc(this.state.currentDoc.uniqueId).collection('submitted')
            .doc(this.state.uid).set({
                fileUrl : url,
                name : this.state.email,
                profileUrl : this.state.profileUrl,
                email : this.state.email,
                time : new Date().toString(),
                completed : false,
                privateComment : '',
                mark : '',
                uid : this.state.uid,
                assignmentId : this.state.currentDoc.uniqueId,
                contentId : this.state.currentDoc.id,
                point : this.state.currentDoc.point

            }
            ).then(()=> {
                handleNotification('Task Submitted')
                $('#markBtn').css('backgroundColor', 'orange')
                $('#privateBtn').css('color', 'orange')
                $('#markBtn').removeAttr('disabled')
                $('#privateBtn').removeAttr('disabled')
                $('#markBtn').click(()=> {this.mark()})
                $('#privateBtn').click(()=> {this.privateComment()})

            }).catch(e => handleNotification(e))
        }).then(()=> {})

    }).catch(e => {handleNotification(e)})

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
        let commentList = []
        let totalComments = 0
        let message = $('#commentMessage').val()
        if(this.state.isVideo && message+ '' !== ''){
            console.log(this.state.currentVideo)
            let current = this.state.currentVideo
            let moment = new Date().toLocaleString()
            let regEx = new RegExp('/', 'g')
            let date = moment.replace(regEx, '-')
            db.collection('videos').doc(id).collection(id).doc(current.uniqueId)
            .collection('comments').doc(new Date().toString()).set({
                comment : message,
                time : date
            }).then(()=> {
                 // add comment to page 
                 db.collection('videos').doc(id).collection(id).doc(current.uniqueId).collection('comments')
                 .get().then(comments => {
                 comments.forEach(comment => {
                     commentList.push(comment.data())
                     totalComments ++
                 })
                 this.setState({
                     comments : commentList.reverse(),
                     totalComments : totalComments
                 })
                 handleNotification('Comment Added')
                 $('#commentMessage').val('')
             })

            })

        }else if(!this.state.isVideo && message+ '' !== '') {
            let current = this.state.currentDoc
            let moment = new Date().toLocaleString()
            let regEx = new RegExp('/', 'g')
            let date = moment.replace(regEx, '-')
            db.collection('deliverables').doc(id).collection(id).doc(current.uniqueId)
            .collection('comments').doc(new Date().toString()).set({
                comment : message,
                time : date
            }).then(()=> {
                // add comment to page 
                db.collection('deliverables').doc(id).collection(id).doc(current.uniqueId).collection('comments')
                .get().then(comments => {
                comments.forEach(comment => {
                    commentList.push(comment.data())
                    totalComments ++
                })
                this.setState({
                    comments : commentList.reverse(),
                    totalComments : totalComments
                })
                handleNotification('Comment Added')
                $('#commentMessage').val('')
            })

            })


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
                        <Header />
                        <div className='topicWrapper'>
                            <div className='currentCourse'>
                                <h2>{this.state.currentTitle}</h2>
                                <p id='parentDesc'>{this.state.currentTitleDesc}</p>
                                <button onClick={ e => this.toggle(e,'#parentDesc')}>Hide Description</button>
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