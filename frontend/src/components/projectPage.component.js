import React, {Component} from "react";
import Row from 'react-bootstrap/Row';
import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect, useRef} from "react";
import {Rating} from 'react-simple-star-rating'
import {Button} from "bootstrap";
import "./styles.scss"
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import Popup from 'reactjs-popup';
import {Navbar, Nav, Dropdown} from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import ReportPopup from './ReportPopup';


var stompClient = null;
export default function ProjectPage(props) {
    const [messagesHistory, setMessagesHistory] = useState([])
    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);
    const [hasLoaded, setHasLoaded] = useState()
    const [userInvite, setUserInvite] = useState('')
    const [userInviteRecommended, setUserInviteRecommended] = useState('')
    const [reviewsByUser, setReviewsByUser] = useState([])
    const [ratedUser, setRatedUser] = useState('')
    const [requests, setRequests] = useState([])
    const [reviews, setReviews] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [open, setOpen] = useState(false);
    const [openRecommended, setOpenRecommended] = useState(false);
    const [projectInvites, setProjectInvites] = useState([])
    const [changeInfo, setChangeInfo] = useState(false)
    const [newInfo, setNewInfo] = useState(project.additionalInfo || "")
    const [borderWidth, setBorderWidth] = useState(100);
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    const [ownerPane, setOwnerPane] = useState(false)
    const [inputs, setInputs] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [changeDesc, setChangeDesc] = useState(false)
    const [newDesc, setNewDesc] = useState('')

    const [isReportPopupVisible, setIsReportPopupVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const reportButtonRef = useRef(null);


    const showReportPopup = () => {
        setIsReportPopupVisible(true);
    };

    const hideReportPopup = () => {
        setIsReportPopupVisible(false);
    };


    const navigate = useNavigate();
    let {id} = useParams();
    const handleNameChange = event => {
        setUserInvite(event.target.value)
    };
    const endProject = event => {
        const url = 'http://localhost:8080/api/project/end/' + id
        const requestOptions = {
            method: 'PUT',
            headers: {'Authorization': 'Bearer ' + user.accessToken},

        };
        fetch(url, requestOptions)
        window.location.reload(false);
    }
    let ratingWorking = [];
    let comments = [];

    const handleRating = (rate, index) => {

        ratingWorking[index] = rate
        console.log(ratingWorking[index], index)

    }
    const changeInfoValue = event => {
        setChangeInfo(current => !current)
        setNewInfo(project.additionalInfo)

    }
    const saveNewInfo = event => {
        const url = 'http://localhost:8080/api/project/info/' + id
        const requestOptions = {
            method: 'PATCH',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},
            body: JSON.stringify({'additionalInfo': newInfo})
        };

        fetch(url, requestOptions)
        console.log("dizala")
        window.location.reload(false);

    };
    const changeNewInfo = event => {
        setNewInfo(event.target.value)


    }
    const closeModal = () => setOpen(false);

    const onPointerEnter = (userrate) => {
        setRatedUser(userrate.username)
    }
    const onPointerLeave = () => console.log('Leave')


    const sendRating = (index) => {


        const url = 'http://localhost:8080/api/project/rateuser'
        console.log("ratingWorking index: ", ratingWorking[index])
        console.log("index: ", index)
        console.log(comments[index])
        const requestOptions = {
            method: 'PUT',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                'score': ratingWorking[index],
                'comment': comments[index],
                'username': ratedUser,
                'projectId': id
            })

        };
        console.log(requestOptions)
        fetch(url, requestOptions)

    }

    const connect = () => {
        console.log("probuje polaczyc")
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        console.log("laczy")
        setUserData({...userData, "connected": true});

        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: user.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);

                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const deleteProject = event => {
        const url = 'http://localhost:8080/api/project/' + id
        const requestOptions = {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + user.accessToken}


        };
        console.log(requestOptions)
        fetch(url, requestOptions)
    }

    const onError = (err) => {
        console.log("nie laczy")
        console.log(err);

    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: user.username,
                message: userData.message,
                status: "MESSAGE",
                projectFrom: project,
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }








    const user = JSON.parse(localStorage.getItem('user'));
    const handleSubmit = event => {
        event.preventDefault();
        const url = 'http://localhost:8080/api/invites/save/' + id
        const requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},
            body: JSON.stringify({'invitedUsername': userInvite, 'type': "Invite"})
        };
        fetch(url, requestOptions)
            .then(response => {
                console.log('Submitted successfully');
                setOpen(o => !o)
            })
            .catch(error => console.log('Form submit error', error))
        console.log(requestOptions)
    };


    const handleSubmitRecommended = event => {
        event.preventDefault();
        setUserInviteRecommended(event.target.value)
        console.log(event.target.value)
        const url = 'http://localhost:8080/api/invites/save/' + id
        const requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},
            body: JSON.stringify({'invitedUsername': event.target.value, 'type': "Invite"})
        };
        fetch(url, requestOptions)
            .then(response => {
                console.log('Submitted successfully');
                setOpenRecommended(o => !o)
            })
            .catch(error => console.log('Form submit error', error))
        console.log(requestOptions)
        window.location.reload(false);
    };

    const requestInvite = event => {
        const url = 'http://localhost:8080/api/invites/save/' + id
        console.log(user.username)
        const requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},
            body: JSON.stringify({'invitedUsername': user.username, 'type': "Request"})
        };
        fetch(url, requestOptions)
    }

    const acceptRequest = event => {
        const url = 'http://localhost:8080/api/invites/accept/' + event.target.value
        const requestOptions = {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json'},

        };
        fetch(url, requestOptions)
        window.location.reload(false);

    }

    const handleCommentChange = (event, index) => {
        comments[index] = event.target.value
        console.log(comments[index])
    }
    const redirectToUser = (userRed) => {
        navigate("/profile/" + userRed)
    }


    const changeNewDesc = event => {
        setNewDesc(event.target.value)
    }
    const saveNewDesc = event => {
        const url = 'http://localhost:8080/api/project/desc/'+ id
        const requestOptions = {
            method: 'PATCH',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({  'description': newDesc })
        };
        setChangeDesc(false)
        fetch(url, requestOptions)
        window.location.reload(false);
    }
    const reportProject = event => {

        if (reportProject) {
            const url = 'http://localhost:8080/api/report';
            console.log(reportReason)
            const requestOptions = {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'reason':reportReason, 'projectId': id }),
            };
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Report submitted:', data);
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.log('Report cancelled.');
        }
    };



        //console.log(id)
    useEffect(() => {

        async function getData() {

            const response = await fetch('http://localhost:8080/api/project/' + id, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });
            const response2 = await fetch('http://localhost:8080/api/project/users/' + id, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });
            const responseRequests = await fetch('http://localhost:8080/api/invites/' + id, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });
            //const responseReviews = await fetch('http://localhost:8080/api/ratings/projectReviews/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
            const responseMessages = await fetch('http://localhost:8080/project/messages/' + id, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });
            //const responseUserReviews = await fetch('http://localhost:8080/api/ratings/user/projects/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
            const responseInvites = await fetch('http://localhost:8080/api/projectinvites/' + id, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });

            let actualData = await response.json();
            let actualData2 = await response2.json();
            let actualDataRequests = await responseRequests.json();
            //let actualDataReviews = await responseReviews.json();
            let actualDataMessages = await responseMessages.json();
            //let actualDataUserReviews = await responseUserReviews.json();
            let actualDataProjectInvites = await responseInvites.json();

            console.log(user.username)
            setProject(actualData)
            console.log(actualData)
            setUsers(actualData2)
            setRequests(actualDataRequests)
            //setReviews(actualDataReviews)
            //setReviewsByUser(actualDataUserReviews)
            setProjectInvites(actualDataProjectInvites)
            const responseSuggested = await fetch('http://localhost:8080/api/users/recommended/' + actualData.tech, {
                method: 'GET',
                headers: {"Authorization": 'Bearer ' + user.accessToken}
            });
            console.log(project)
            let actualDataSuggested = await responseSuggested.json();
            setSuggestedUsers(actualDataSuggested)
            setMessagesHistory(actualDataMessages)
            setRating(3);

            setHasLoaded(true)
            console.log(actualDataProjectInvites)

            console.log(actualDataSuggested)
            console.log(users)

            connect()

        }



        getData()
        setNewInfo(project.additionalInfo || '')
    }, [project.additionalInfo]);
    useEffect(() => {

    }, [rating])


    return (
        <>
            <div className={"projectPage"}>


                {project && project.owner && project.owner.username == user.username ?
                    <div className="ownerPanel">
                        <div className="header" onClick={() => setIsOpen(!isOpen)}>
                            Owner Panel
                            <button><i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}/></button>
                        </div>
                        <div className={`content ${isOpen ? 'open' : ''}`}>

                            <div className={"userInviteUsername"}>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <p><h6><b>User to invite</b></h6></p>
                                        <input
                                            type="userInvite"
                                            name="userInvite"
                                            placeholder="Enter name"
                                            onChange={handleNameChange}
                                            value={userInvite}
                                        />
                                    </div>
                                    <button onClick="submit" className="buttonInvite" style={{margin: '5px'}}>
                                        Invite user
                                    </button>
                                </form>
                            </div>

                            <div className="suggestedUsers">
                                <p><h6><b>Suggested Users</b></h6></p>
                                {suggestedUsers.map(suggestedUser => {
                                        return !users.some(el => el.username === suggestedUser.username) && !projectInvites.some(el => el.invitedUsername === suggestedUser.username) ?
                                            <div> {suggestedUser.username}
                                                <button className={"inviteButton"} value={suggestedUser.username}
                                                        onClick={handleSubmitRecommended}>Invite
                                                </button>
                                            </div> : null
                                    }
                                )}
                            </div>
                            <div className={"requests"}>
                                <p><h6><b>Invite requests</b></h6></p>
                                <div>{requests.map(request =>
                                    <div>
                                        1234567

                                        <button className="btn btn-primary" onClick={acceptRequest} value={request.id}
                                                style={{float: 'right', height: '25px', fontSize: '15px'}}>Accept</button>


                                    </div>)}
                                </div>
                            </div>

                            <div className={"ownerOptions"}>
                                {hasLoaded && project.owner.id == user.id ? <button className={"optionButton"} onClick={endProject}>End Project</button> : null}
                                {hasLoaded && project.owner.id == user.id ? <button className={"optionButton"} onClick={deleteProject}>Delete Project</button> : null}
                            </div>
                        </div>

                    </div>:null}

                <div className={"project"}>
                    <div className={"projectInfo"}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="report-button-container">
                            <h5><b>Project information</b></h5>
                            <button onClick={showReportPopup} ref={reportButtonRef} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }} className="report-button">
                                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                            </button>
                            <ReportPopup
                                buttonRef={reportButtonRef}
                                isOpen={isReportPopupVisible}
                                onClose={hideReportPopup}
                                onSubmit={() => reportProject(reportReason)}
                                reportReason={reportReason}
                                setReportReason={setReportReason}
                            />

                        </div>

                        <hr/>

                        <div>

                            <h6><b>Project name:</b></h6>
                            {hasLoaded ? <p>{project.name}</p> : <p>Loading...</p>}
                            <h6><b>Main Language:</b></h6>
                            {hasLoaded ? <p>{project.tech}</p> : <p>Loading...</p>}
                        </div>
                        <div className={"memberList"}>
                            <h6><b>Members:</b></h6>
                            {users.map(user =>
                                <div onClick={() => redirectToUser(user.id)} key={user.id} className="rounded redirectlink">
                                    {user.username}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={"projectDetails"}>
                        <div style={{height:'90%'}}>
                            {changeDesc && project.owner.username == user.username ? <><div class="input-group input-group-sm mb-3">
                                                     <div class="input-group-prepend">
                                                         <span class="input-group-text" id="inputGroup-sizing-sm">New Description</span>
                                                     </div>
                                                     <textarea
                                                         type="newDesc"
                                                         name="newDesc"
                                                         placeholder="New Description"
                                                         onChange={changeNewDesc}
                                                         value={newDesc} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                                                     <button className="btn btn-primary" onClick={saveNewDesc}>Save</button>
                                                 </div></>: project.description }

                        </div>
                        {project && project.owner && project.owner.username == user.username ? <div style={{height:'10%'}}><button onClick={() => setChangeDesc(true)} style={{float:'right'}}>Update description</button></div>:null}

                    </div>
                    <div className={"chat"}>
                        {users.some(userIs => (userIs.username === user.username)) ? <div className="rounded" style={{ width: '100 %' }}>
                            {userData.connected ?
                                <div style={{padding:'3px'}} >
                                    <h5><b>Chat</b></h5>
                                    {tab === "CHATROOM" && <div className="chat-content">
                                        <div className={"messages"}>
                                            {publicChats.reverse().map((chat, index) => (

                                                    <div key={index} className={`message ${chat.senderName === user.username ? 'my-message' : 'other-message'}`}>
                                                        <p>{chat.senderName}<hr />{chat.message}</p>
                                                    </div>

                                            ))}
                                            {messagesHistory.map(message =>
                                                <div style={{}}>
                                                    <div className={`message ${message.senderName === user.username ? 'my-message' : 'other-message'}`}>
                                                        <p>{message.senderName}<hr />{message.message}</p>
                                                    </div>
                                                </div>)}
                                        </div>
                                        <div>
                                            <div>
                                                <span id="basic-addon1">Message</span>
                                            </div>
                                            <div className="input-group">
                                                <input type="text" className="form-control" value={userData.message}
                                                       onChange={handleMessage} maxLength="500"/>
                                                <button type="button" className="btn btn-primary"
                                                        onClick={sendValue}>send
                                                </button>
                                            </div>

                                        </div>
                                    </div>}

                                </div>
                                :
                                null}
                        </div> : null}
                    </div>
                    <div className={"moreInfo"}>
                        <div style={{height:'90%'}}>
                            {changeInfo && project.owner.username == user.username ? <><div class="input-group input-group-sm mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-sm">New Description</span>
                                </div>
                                <textarea
                                    type="newInfo"
                                    name="newInfo"
                                    defaultValue={project ? project.additionalInfo : ''}
                                    onChange={changeNewInfo}
                                    value={newInfo} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                                <button className="btn btn-primary" onClick={saveNewInfo}>Save</button>
                            </div></>: project.additionalInfo }
                        </div>
                        {project && project.owner && project.owner.username == user.username ? <div style={{height:'10%'}}><button onClick={() => setChangeInfo(true)} style={{float:'right'}}>Update information</button></div>:null}

                    </div>

                </div>




            </div>
        </>
    )


}
