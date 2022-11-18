
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating'





export default function ProjectPage(props) {
    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);
    const [hasLoaded, setHasLoaded] = useState();
    const [userInvite, setUserInvite] = useState('')
    //const [rating, setRating] = useState(0)
    const [ratedUser, setRatedUser] = useState('')
    const [requests, setRequests] = useState('')
    
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
    // const handleRatingChange = event => {
    //   setRating(event.target.rating)
    // };
    const handleRating = ( rate,value) => {
      //setRating(rate)
      
      //console.log(rating)
      console.log(ratedUser)
      const url = 'http://localhost:8080/api/project/rateuser/' + id + '/' + ratedUser
      const requestOptions = {
        method: 'PUT',
        headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({'score':rate})

    };
    console.log(requestOptions)
    fetch(url, requestOptions)
  
      // other logic
    }

    const onPointerEnter = (userrate) => setRatedUser(userrate.username)
    const onPointerLeave = () => console.log('Leave')
    const onPointerMove = (value, index) => console.log(user.username,project.owner.username)

    const sendRating = event =>{
      console.log(event.target.value)
      
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
   
    
    
    //console.log(id)
    useEffect(() => {
        
        async function getData(){
            
            const response = await fetch('http://localhost:8080/api/project/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const response2 = await fetch('http://localhost:8080/api/project/users/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const responseRequests = await fetch('http://localhost:8080/api/invites/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            let actualData = await response.json();
            let actualData2 = await response2.json();
            let actualDataRequests = await responseRequests.json();
            //console.log(actualData)
            setProject(actualData)
            setUsers(actualData2)
            setRequests(actualDataRequests)
            setHasLoaded(true)
            console.log(users)
            
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
      {/* <button onClick={endProject}>End Project</button>  */}
      <div style={{width:'50%',padding:'10px'}} className="rounded border"><h5>Invite requests:</h5></div></Row>
      </>
       : null}
       {!project.finished && hasLoaded && !users.includes(user) && users.length < project.maxUsers ?
       
       <button type="submit" onClick={requestInvite} className="btn btn-primary" style={{margin:'5px'}}>
       Request invite
     </button>: null
      
      
      }
        
        
        
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
            <div style={{width:'20%'}} className="rounded border"><h5>Rate users</h5>
            <hr/>
            
            {users.map(userrate =>
              {return userrate.username != user.username ?
                <div className="rounded border" key={userrate.id}>
                {userrate.username}
                <Rating
                  
                  onClick={handleRating}
                  onPointerEnter={()=>onPointerEnter(userrate)}
                  //onPointerLeave={onPointerLeave}
                  onPointerMove={onPointerMove}
                  size="30"
                  /* Available Props */
                />
                
              </div>: null } 
                
                  
              )}
            
            
            </div>: <></>}
            
        </Row>
        </>
    )
    

    
  
    
  
    
    
  
  



  
}
