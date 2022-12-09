
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { Rating } from 'react-simple-star-rating'
import { Button } from "bootstrap";

import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Popup from 'reactjs-popup';




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
  const [requests, setRequests] = useState('')
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
  const [newInfo, setNewInfo] = useState('')
  const [borderWidth, setBorderWidth] = useState(100);
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: ''
  });
  const [ownerPane, setOwnerPane] = useState(false)
  const [inputs, setInputs]= useState([])
  

  const navigate = useNavigate();
  let { id } = useParams();
  const handleNameChange = event => {
    setUserInvite(event.target.value)
  };
  const endProject = event => {
    const url = 'http://localhost:8080/api/project/end/' + id
    const requestOptions = {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + user.accessToken },

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
const saveNewInfo = event =>{
  const url = 'http://localhost:8080/api/project/info/' + id
    const requestOptions = {
      method: 'PATCH',
      headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({  'additionalInfo': newInfo })
  };
  
  fetch(url, requestOptions)
  console.log("dizala")
  window.location.reload(false);
  
};
const changeNewInfo = event => {
  setNewInfo(event.target.value)
  


}
  const closeModal = () => setOpen(false);
  
  const onPointerEnter = (userrate) => { setRatedUser(userrate.username)}
  const onPointerLeave = () => console.log('Leave')
  

  const sendRating = (index) => {
    
    
    const url = 'http://localhost:8080/api/project/rateuser/' + id + '/' + ratedUser
    console.log("ratingWorking index: ", ratingWorking[index])
    console.log("index: ", index)
    console.log(comments[index])
    const requestOptions = {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'score': ratingWorking[index], 'comment': comments[index] })

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
    setUserData({ ...userData, "connected": true });

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

  const deleteProject = event =>{
    const url = 'http://localhost:8080/api/project/' + id
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + user.accessToken }
      

    };
    console.log(requestOptions)
    fetch(url, requestOptions)
  }

  const onError = (err) => {
    console.log("nie laczy")
    console.log(err);

  }

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, "message": value });
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
      setUserData({ ...userData, "message": "" });
    }
  }

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE"
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, "message": "" });
    }
  }

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, "username": value });
  }

  const registerUser = () => {
    connect();
  }
  

  

  const user = JSON.parse(localStorage.getItem('user'));
  const handleSubmit = event => {
    event.preventDefault();
    const url = 'http://localhost:8080/api/invites/save/' + id
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'invitedUsername': userInvite, 'type': "Invite" })
    };
    fetch(url, requestOptions)
      .then(response => {console.log('Submitted successfully');setOpen(o => !o)})
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
      headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'invitedUsername': event.target.value, 'type': "Invite" })
    };
    fetch(url, requestOptions)
      .then(response => {console.log('Submitted successfully');setOpenRecommended(o => !o)})
      .catch(error => console.log('Form submit error', error))
    console.log(requestOptions)
    window.location.reload(false);
  };

  const requestInvite = event => {
    const url = 'http://localhost:8080/api/invites/save/' + id
    console.log(user.username)
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'invitedUsername': user.username, 'type': "Request" })
    };
    fetch(url, requestOptions)

  }

  const acceptRequest = event => {
    const url = 'http://localhost:8080/api/invites/accept/' + event.target.value
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },

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
  const ownerPageHandler = event => {
    
  }
  const handleTime = () =>{
    // Keep a reference to the interval ID returned by setInterval
    

    // Schedule the popup to be closed after 3 seconds
    const timeoutId = setTimeout(() => setOpen(false), 3000);

    // Return a cleanup function that will be called when the Popup is closed
    return () => {
      
      clearTimeout(timeoutId);
    };
  }





  //console.log(id)
  useEffect(() => {

    async function getData() {

      const response = await fetch('http://localhost:8080/api/project/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const response2 = await fetch('http://localhost:8080/api/project/users/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const responseRequests = await fetch('http://localhost:8080/api/invites/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const responseReviews = await fetch('http://localhost:8080/api/ratings/projectReviews/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const responseMessages = await fetch('http://localhost:8080/project/messages/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const responseUserReviews = await fetch('http://localhost:8080/api/ratings/user/projects/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
      const responseInvites = await fetch('http://localhost:8080/api/projectinvites/' + id, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });

      let actualData = await response.json();
      let actualData2 = await response2.json();
      let actualDataRequests = await responseRequests.json();
      let actualDataReviews = await responseReviews.json();
      let actualDataMessages = await responseMessages.json();
      let actualDataUserReviews = await responseUserReviews.json();
      let actualDataProjectInvites = await responseInvites.json();

      console.log(user.username)
      setProject(actualData)
      console.log(actualData)
      setUsers(actualData2)
      setRequests(actualDataRequests)
      setReviews(actualDataReviews)
      setReviewsByUser(actualDataUserReviews)
      setProjectInvites(actualDataProjectInvites)
      const responseSuggested = await fetch('http://localhost:8080/api/users/recommended/' + actualData.tech, { method: 'GET', headers: { "Authorization": 'Bearer ' + user.accessToken } });
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
  }, []);
  useEffect(() => {
    
  },[rating])


  return (
    <>
    <Popup onOpen={handleTime} open={open} contentStyle={{width:'10%', borderRadius:"10px", bottom:'45%', padding:'10px',height:'5%',backgroundColor:'#F2AA4CFF', borderColor:'black',left:'40%'}} className="rounded" position="top center">
          <div>Invited user {userInvite}</div>
        </Popup>
        <Popup open={openRecommended} contentStyle={{width:'10%', borderRadius:"10px", bottom:'45%', padding:'10px',height:'5%',backgroundColor:'#F2AA4CFF', borderColor:'black',left:'40%'}} className="rounded" position="top center">
          <div>Invited user {userInviteRecommended}</div>
        </Popup>
      {!project.finished && hasLoaded && project.owner.username == user.username ?
        <>
          <Row xs={2} md={2} lg={2} className="g-7">

            <div id="profile" style={{ width: '20%', padding: '10px' }} className="rounded">
              <form onSubmit={handleSubmit}>
                <div >
                  <label>User to invite:</label>
                  <input
                    type="userInvite"
                    name="userInvite"
                    placeholder="Enter name"
                    onChange={handleNameChange}
                    value={userInvite}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ margin: '5px' }}>
                  Invite user
                </button>
              </form>

            </div>

            <div style={{ width: '35%', padding: '10px' }} className="rounded" id="profile"><h5>Invite requests:</h5>


              {requests.map(request =>
                <div className="rounded" style={{ margin: '10px', padding: '5px',backgroundColor:'#d4943f' }}>
                  {request.invitedUsername}
                  
                  <button className="btn btn-primary" onClick={acceptRequest} value={request.id} style={{float:'right', height:'25px', fontSize:'15px'}}>Accept</button>
                  





                </div>)}




            </div>
            <div id="profile" className="rounded" style={{ width: '40%', padding: '10px' }}>Suggested Users:
              {suggestedUsers.map(suggestedUser => { return !users.some(el => el.username === suggestedUser.username) && !projectInvites.some(el => el.invitedUsername === suggestedUser.username)  ? <div className="rounded" style={{ margin: '10px', padding: '5px',backgroundColor:'#d4943f' }}> {suggestedUser.username}<button style={{float:'right', height:'25px', fontSize:'15px'}} value={suggestedUser.username} onClick={handleSubmitRecommended}>Invite</button></div> : null }


              )}
            </div></Row>
        </>
        : null}
      {!project.finished && hasLoaded && !users.some(userSome => (userSome.username === user.username)) && users.length < project.maxUsers ?

        <button type="submit" onClick={requestInvite} className="btn btn-primary" style={{ margin: '5px' }}>
          Request invite
        </button> : null


      }
      {hasLoaded && project.owner.id == user.id ? <button onClick={endProject} className="btn btn-primary">End Project</button> : null}
      {hasLoaded && project.owner.id == user.id ? <button onClick={deleteProject} className="btn btn-primary">Delete Project</button> : null}



      <Row xs={3} md={3} lg={3} className="g-7">

        <div id="profile" style={{ width: '20%', padding: '10px' }} className="rounded">
          <h5><b>Project information</b></h5>

          <hr />

          <div >

            <h6><b>Project name:</b></h6>
            {hasLoaded ? <p>{project.name}</p> : <p>Loading...</p>}
            <h6><b>Main Language:</b></h6>
            {hasLoaded ? <p>{project.tech}</p> : <p>Loading...</p>}



            <h6><b>Owner:</b></h6>
            {hasLoaded ? <p>{project.owner.username}</p> : <p>Loading...</p>}





          </div>

        </div>
        <div id="profile" style={{ width: '55%', padding: '10px' }} className="rounded"><h5><b>Description</b></h5>
          <hr />
          {project.description}
        </div>


        <div id="profile" style={{ width: '20%', padding: '10px' }} className="rounded"><h5><b>Users ({users.length}/{project.maxUsers})</b></h5>
          <hr />
          {users.map(user =>
            <div onClick={() => redirectToUser(user.id)} key={user.id} className="rounded redirectlink" style={{ margin: '10px', padding: '5px',backgroundColor:'#d4943f' }}>
              {user.username}
            </div>
          )}
        </div>
        {project.finished && users.length > 1 && reviewsByUser.length < users.length - 1 ?
          <div style={{ width: '98%', padding:'3px' }} className="rounded" id="profile"><h5><b>Rate users</b></h5>
            <hr />

            {users.map((userrate, index) => {
              
              return userrate.username != user.username && !reviews.some(review => (review.user.username == userrate.username && review.project.id == id && review.ratingUser.username == user.username)) ?

                <div className="rounded" style={{padding:'3px', margin:'3px',  backgroundColor:'#d4943f'}} key={userrate.id} onPointerEnter={() => onPointerEnter(userrate)}>
                  {userrate.username}

                  <Rating
                    value={ratingWorking[index]}
                    onClick={(rate, e) =>handleRating(rate, index)}

                    //onPointerLeave={onPointerLeave}
                    
                    size="30"
                  /* Available Props */
                  />
                  <br />
                  <input type="text" id={userrate.id} name="comment" onChange={(e) => handleCommentChange(e,index)} value={comments[index]}></input>
                  <button onClick={() => sendRating(index)}>Send your rating</button>

                </div>
                : null
            }


            )}


          </div> : <></>}



      </Row>
      <Row style={{ width: '100%' }}>
        {users.some(userIs => (userIs.username === user.username)) ? <div id="profile" className="rounded" style={{ width: '100 %' }}>
          {userData.connected ?
            <div style={{padding:'3px'}} >

            <h5><b>Chat</b></h5>
              {tab === "CHATROOM" && <div className="chat-content">
                <div  style={{borderRight:'none',borderRadius:'10px',border:'solid 1px',borderColor:'#101820FF' ,overflowY: 'scroll', overflowWrap: 'break-word', height: '20vh', display: 'flex', flexDirection: 'column-reverse' }}>
                {publicChats.reverse().map((chat, index) => (
                    <>
                      <div key={index}>
                        {chat.senderName === user.username ? <> <div class="p-3 ms-3" style={{ borderRadius: '15px', backgroundColor: 'rgba(57, 192, 237,.2)', margin: '3px', width: '60%' }}>
                          <p class="small mb-0">{chat.senderName}<hr />{chat.message}</p>
                        </div></> : <div class="p-3 ms-3" style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 10,10,.2)', margin: '3px', width: '60%',float:'right' }}>
                          <p class="small mb-0">{chat.senderName}<hr />{chat.message}</p>
                        </div>}


                      </div>
                    </>
                  ))}
                
                
                {messagesHistory.map(message =>
                    <div style={{}}>
                      


                      {message.senderName === user.username ? <> <div class="p-3 ms-3" style={{ borderRadius: '15px', backgroundColor: 'rgba(57, 192, 237,.2)', margin: '3px', width: '60%' }}>
                        <p class="small mb-0">{message.senderName}<hr />{message.message}</p>
                      </div></> : <div class="p-3 ms-3" style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 10,10,.2)', margin: '3px', width: '60%',float:'right' }}>
                        <p class="small mb-0">{message.senderName}<hr />{message.message}</p>
                      </div>}


                    </div>)}
                  



                  
                  



                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Message</span>
                  </div>
                  <input type="text" class="form-control" value={userData.message} onChange={handleMessage} maxlength="500" />
                  <button type="button" className="btn btn-primary" onClick={sendValue}>send</button>
                </div>
              </div>}

            </div>
            :
            null}
        </div> : null}
      </Row>
      <Row>
      {users.some(userIs => (userIs.username === user.username)) ? 
      <div style={{width:'98%'}} id="profile"><h5><b>Private information</b></h5><hr />
      {!changeInfo ? <div>{project.additionalInfo}</div>:null}
        {project.owner.username === user.username ? <button style={{float:'right', background:'none', color:'inherit', border:'none', color:'blue'}}  onClick={changeInfoValue}> Change information</button>: null}
        {changeInfo && <><div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">New Info</span>
              </div>
              <textarea 
              type="newDesc"
              name="newDesc"
              placeholder={project.additionalInfo}
              onChange={changeNewInfo}
              value={newInfo} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
              <button className="btn btn-primary" onClick={saveNewInfo}>Save</button>
            </div></>}






        </div>:null}
        
      </Row>
    </>
  )














}
