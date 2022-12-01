
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating'
import { Button } from "bootstrap";

import {over} from 'stompjs';
import SockJS from 'sockjs-client';




var stompClient =null;
export default function ProjectPage(props) {
    const [messagesHistory, setMessagesHistory] = useState([])
    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);
    const [hasLoaded, setHasLoaded] = useState()
    const [userInvite, setUserInvite] = useState('')
    
    const [ratedUser, setRatedUser] = useState('')
    const [requests, setRequests] = useState('')
    const [reviews, setReviews] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });

    
    let { id } = useParams();
    const handleNameChange = event => {
        setUserInvite(event.target.value)
    };
    const endProject = event => {
      const url = 'http://localhost:8080/api/project/end/' + id
      const requestOptions = {
        method: 'PUT',
        headers: {  'Authorization':'Bearer ' + user.accessToken },
        
      };  
      fetch(url, requestOptions)
      window.location.reload(false);
    }
    
    const handleRating = ( rate,value) => {
      setRating(rate)
      
      
      console.log(ratedUser)
      
  
      
    }

    const onPointerEnter = (userrate) => {setRatedUser(userrate.username); setRating(0)}
    const onPointerLeave = () => console.log('Leave')
    const onPointerMove = (value, index) => console.log(user.username,project.owner.username)

    const sendRating = event =>{
      const url = 'http://localhost:8080/api/project/rateuser/' + id + '/' + ratedUser
      const requestOptions = {
        method: 'PUT',
        headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({'score':rating, 'comment':comment})

    };
    console.log(requestOptions)
    fetch(url, requestOptions)
      
    }

    const connect =()=>{
      console.log("probuje polaczyc")
      let Sock = new SockJS('http://localhost:8080/ws');
      stompClient = over(Sock);
      stompClient.connect({},onConnected, onError);
  }

  const onConnected = () => {
      console.log("laczy")
      setUserData({...userData,"connected": true});
      
      stompClient.subscribe('/chatroom/public', onMessageReceived);
      stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
      userJoin();
  }

  const userJoin=()=>{
        var chatMessage = {
          senderName: user.username,
          status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  }

  const onMessageReceived = (payload)=>{
      var payloadData = JSON.parse(payload.body);
      switch(payloadData.status){
          case "JOIN":
              if(!privateChats.get(payloadData.senderName)){
                  privateChats.set(payloadData.senderName,[]);
                  setPrivateChats(new Map(privateChats));
              }
              break;
          case "MESSAGE":
              publicChats.push(payloadData);
              setPublicChats([...publicChats]);
              break;
      }
  }
  
  const onPrivateMessage = (payload)=>{
      console.log(payload);
      var payloadData = JSON.parse(payload.body);
      if(privateChats.get(payloadData.senderName)){
          privateChats.get(payloadData.senderName).push(payloadData);
          setPrivateChats(new Map(privateChats));
      }else{
          let list =[];
          list.push(payloadData);
          privateChats.set(payloadData.senderName,list);
          setPrivateChats(new Map(privateChats));
      }
  }

  const onError = (err) => {
      console.log("nie laczy")
      console.log(err);
      
  }

  const handleMessage =(event)=>{
      const {value}=event.target;
      setUserData({...userData,"message": value});
  }
  const sendValue=()=>{
          if (stompClient) {
            var chatMessage = {
              senderName: user.username,
              message: userData.message,
              status:"MESSAGE",
              projectFrom:project,
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }
  }

  const sendPrivateValue=()=>{
      if (stompClient) {
        var chatMessage = {
          senderName: userData.username,
          receiverName:tab,
          message: userData.message,
          status:"MESSAGE"
        };
        
        if(userData.username !== tab){
          privateChats.get(tab).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({...userData,"message": ""});
      }
  }

  const handleUsername=(event)=>{
      const {value}=event.target;
      setUserData({...userData,"username": value});
  }

  const registerUser=()=>{
      connect();
  }
    
    const user = JSON.parse(localStorage.getItem('user'));
    const handleSubmit = event => {
        event.preventDefault();
        const url = 'http://localhost:8080/api/invites/save/' + id
        const requestOptions = {
            method: 'POST',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({'invitedUsername':userInvite, 'type':"Invite"})
        };
        fetch(url, requestOptions)
            .then(response => console.log('Submitted successfully'))
            .catch(error => console.log('Form submit error', error))
            console.log(requestOptions)
      };


      const handleSubmitRecommended = event => {
        event.preventDefault();
        setUserInvite(event.target.value)
        console.log(event.target.value)
        const url = 'http://localhost:8080/api/invites/save/' + id
        const requestOptions = {
            method: 'POST',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({'invitedUsername':event.target.value, 'type':"Invite"})
        };
        fetch(url, requestOptions)
            .then(response => console.log('Submitted successfully'))
            .catch(error => console.log('Form submit error', error))
            console.log(requestOptions)
      };
      
    const requestInvite = event => {
      const url = 'http://localhost:8080/api/invites/save/' + id
      console.log(user.username)
      const requestOptions = {
        method: 'POST',
        headers: {'Authorization':'Bearer ' + user.accessToken, 'Content-Type':'application/json'},
        body: JSON.stringify({'invitedUsername':user.username,'type':"Request"})
      };
      fetch(url, requestOptions)
      
    }

    const acceptRequest = event => {
      const url = 'http://localhost:8080/api/invites/accept/' + event.target.value
    const requestOptions = {
                 method: 'DELETE',
                 headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
                 
             };
             fetch(url, requestOptions)
             window.location.reload(false);

    }

    const handleCommentChange = event => {
      setComment(event.target.value)
    }

    
   
    
    
    //console.log(id)
    useEffect(() => {
        
        async function getData(){
            
            const response = await fetch('http://localhost:8080/api/project/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const response2 = await fetch('http://localhost:8080/api/project/users/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const responseRequests = await fetch('http://localhost:8080/api/invites/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const responseReviews = await fetch('http://localhost:8080/api/ratings/projectReviews/' + id,  {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const responseMessages = await fetch('http://localhost:8080/project/messages/' + id,  {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            

            let actualData = await response.json();
            let actualData2 = await response2.json();
            let actualDataRequests = await responseRequests.json();
            let actualDataReviews = await responseReviews.json();
            let actualDataMessages = await responseMessages.json();
            
            console.log(user.username)
            setProject(actualData)
            console.log(actualData)
            setUsers(actualData2)
            setRequests(actualDataRequests)
            setReviews(actualDataReviews)
            const responseSuggested = await fetch('http://localhost:8080/api/users/recommended/' + actualData.tech,  {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            console.log(project)
            let actualDataSuggested = await responseSuggested.json();
            setSuggestedUsers(actualDataSuggested)
            setMessagesHistory(actualDataMessages)
            setHasLoaded(true)

            console.log(actualDataSuggested)
            console.log(users)
            connect()
            
        }
        
        
        getData()
       }, []);
    
    
    return (
        <>
        { !project.finished && hasLoaded && project.owner.username == user.username ?
        <>
        <Row xs={2} md={2} lg={2} className="g-7">
        
        <div  style={{width:'50%', padding:'10px'}} className="rounded border">
        <form onSubmit={handleSubmit}>
        <div>
          <label>User to invite:</label>
          <input
            type="userInvite"
            name="userInvite"
            placeholder="Enter name"
            onChange={handleNameChange}
            value={userInvite}
          />
          </div>
          <button type="submit" className="btn btn-primary" style={{margin:'5px'}}>
          Invite user 
        </button>
      </form>
      
      </div>
      
      <div style={{width:'50%',padding:'10px'}} className="rounded border"><h5>Invite requests:</h5>
      <div>Suggested Users:
      {suggestedUsers.map(suggestedUser =>
              { return !users.some(el=>el.username === suggestedUser.username) ? <div>{suggestedUser.username}<button value={suggestedUser.username} onClick={handleSubmitRecommended}>Invite</button></div>:null}
                
                  
              )}
      </div>
      
      {requests.map(request =>
        <div>
          {request.invitedUsername}
          <button onClick={acceptRequest} value={request.id}>Accept</button>





        </div>)}
      
      
      
      </div></Row>
      </>
       : null}
       {!project.finished && hasLoaded && !users.includes(user) && users.length < project.maxUsers ?
       
       <button type="submit" onClick={requestInvite} className="btn btn-primary" style={{margin:'5px'}}>
       Request invite
     </button>: null
      
      
      }
      {hasLoaded && project.owner.id == user.id ? <button onClick={endProject} className="btn btn-primary">End Project</button> : null}
        
        
        
        <Row xs={3} md={3} lg={3} className="g-7">
        
            <div style={{width:'20%' ,padding:'10px'}} className="rounded border">
                <h5>Project information</h5>
                
                <hr/>

                <div >

                    <h6>Project name:</h6>
                    {hasLoaded ? <p>{project.name}</p> : <p>Loading...</p>}
                    <h6>Main Language:</h6>
                    {hasLoaded ? <p>{project.tech}</p> : <p>Loading...</p>}
                
                

                <h6>Owner:</h6>
                {hasLoaded ? <p>{project.owner.username}</p> : <p>Loading...</p>}
                
                
                
                
                
                </div>
                
            </div>
            <div style={{width:'60%',padding:'10px'}} className="rounded border"><h5>Description</h5>
            <hr/>
            {project.description}
            </div>


            <div style={{width:'20%',padding:'10px'}} className="rounded border"><h5>Users ({users.length}/{project.maxUsers})</h5>
            <hr/>
            {users.map(user =>
                  <div key={user.id} className="rounded border" style={{margin:'10px',padding:'5px'}}>
                    {user.username}
                  </div>
              )}
            </div>
            {project.finished && users.length > 1? 
            <div style={{width:'100%'}} className="rounded border"><h5>Rate users</h5>
            <hr/>
            
            {users.map(userrate =>
              {return userrate.username != user.username &&  !reviews.some(review => (review.user.username == userrate.username && review.project.id == id && review.ratingUser.username == user.username)) ?
                
                <div className="rounded border" key={userrate.id} onPointerEnter={()=>onPointerEnter(userrate)}>
                {userrate.username}
                
                <Rating
                  
                  onClick={handleRating}
                  
                  //onPointerLeave={onPointerLeave}
                  onPointerMove={onPointerMove}
                  size="30"
                  /* Available Props */
                />
                <br/>
                <input type="text" id={userrate.id} name="comment" onChange={handleCommentChange} value={comment}></input>
                <button onClick={sendRating}>Send your rating</button>
                
              </div>
              : null } 
                
                  
              )}
            
            
            </div>: <></>}
            <div className="container">
        {userData.connected?
        <div className="chat-box rounded border">
          
            Chat
            {tab==="CHATROOM" && <div className="chat-content">
            <div className="rounded border">
                <ul style={{listStyle:'none'}} className="chat-messages">
                    {messagesHistory.map(message => 
                    <li >
                            
                            
                            {message.senderName === user.username ? <> <div class="p-3 ms-3" style={{borderRadius:'15px',backgroundColor:'rgba(57, 192, 237,.2)',margin:'3px'}}>
                            <p class="small mb-0">{message.senderName}<hr/>{message.message}</p>
              </div></>:<div class="p-3 ms-3" style={{borderRadius:'15px',backgroundColor:'rgba(255, 10,10,.2)',margin:'3px'}}>
                            <p class="small mb-0">{message.senderName}<hr/>{message.message}</p>
              </div>}
                            
                            
                        </li>)}
                    {publicChats.map((chat,index)=>(
                      <>
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                        </>
                    ))}
                </ul>

               
                </div>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            
        </div>
        :
        null}
    </div>
            
        </Row>
        </>
    )
    

    
  
    
  
    
    
  
  



  
}
