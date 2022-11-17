
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
    const onPointerMove = (value, index) => console.log(value, index)

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
            body: JSON.stringify({'invitedUsername':userInvite})
        };
        fetch(url, requestOptions)
            .then(response => console.log('Submitted successfully'))
            .catch(error => console.log('Form submit error', error))
            console.log(requestOptions)
      };
      
   
    
    
    //console.log(id)
    useEffect(() => {
        
        async function getData(){
            
            const response = await fetch('http://localhost:8080/api/project/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            const response2 = await fetch('http://localhost:8080/api/project/users/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
            let actualData = await response.json();
            let actualData2 = await response2.json();
            //console.log(actualData)
            setProject(actualData)
            setUsers(actualData2)
            setHasLoaded(true)
            console.log(users)
            
        }
        
        
        getData()
       }, []);
    
    
    return (
        <>
        <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Project Name</label>
            <input
              type="userInvite"
              name="userInvite"
              placeholder="Enter name"
              onChange={handleNameChange}
              value={userInvite}
            />
            </div>
            <button type="submit">
            Submit
          </button>
        </form>
        <button onClick={endProject}>End Project</button>
        </div>
        <Row xs={3} md={3} lg={3} className="g-7">
            <div style={{width:'20%'}} className="rounded border">
                <h5>Project information</h5>
                <hr/>
                <div>
                    <h6>Main Technology:</h6>
                    {hasLoaded ? <p>{project.tech}</p> : <p>Loading...</p>}
                
                <br/>

                <h6>Owner:</h6>
                {hasLoaded ? <p>{project.owner.username}</p> : <p>Loading...</p>}
                
                
                <h6>Description:</h6>
                {hasLoaded ? <p>{project.description}</p> : <p>Loading...</p>}
                
                
                </div>
                
            </div>
            <div style={{width:'60%'}} className="rounded border"><h5>placeholder</h5>
            <hr/>
            </div>


            <div style={{width:'20%'}} className="rounded border"><h5>Users</h5>
            <hr/>
            {users.map(user =>
                  <div key={user.id}>
                    {user.username}
                  </div>
              )}
            </div>
            <div style={{width:'30%'}} className="rounded border"><h5>Rate users</h5>
            <hr/>
            
            {users.map(userrate =>
                  <div className="rounded border">
                    {userrate.username}
                    <Rating
                      key={userrate.id}
                      onClick={handleRating}
                      onPointerEnter={()=>onPointerEnter(userrate)}
                      //onPointerLeave={onPointerLeave}
                      //onPointerMove={onPointerMove}
                      
                      /* Available Props */
                    />
                    
                  </div>
              )}
            
            
            </div>
        </Row>
        </>
    )
    

    
  
    
  
    
    
  
  



  
}
