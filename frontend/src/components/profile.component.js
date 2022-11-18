import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Row from 'react-bootstrap/Row';
import {useParams} from 'react-router-dom';
import { useState, useEffect } from "react";
import { Button } from "bootstrap";

export default function ProjectPage(props) {
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState();
  const [userInvite, setUserInvite] = useState('')
  const [userProjects, setUserProjects] = useState([])
  //let { id } = useParams();
  const handleNameChange = event => {
      setUserInvite(event.target.value)
  };
  const user = JSON.parse(localStorage.getItem('user'));
  // const handleSubmit = event => {
  //     event.preventDefault();
  //     const url = 'http://localhost:8080/api/invites/save/' + id
  //     const requestOptions = {
  //         method: 'POST',
  //         headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
  //         body: JSON.stringify({'invitedUsername':userInvite})
  //     };
  //     fetch(url, requestOptions)
  //         .then(response => console.log('Submitted successfully'))
  //         .catch(error => console.log('Form submit error', error))
  //         console.log(requestOptions)
  //   };
  const acceptInvite = event => {
    //setName(event.target.value)
    const url = 'http://localhost:8080/api/invites/accept/' + event.target.value
    const requestOptions = {
                 method: 'DELETE',
                 headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
                 
             };
             fetch(url, requestOptions)
             window.location.reload(false);
};
  
 
  
  
  //console.log(id)
  useEffect(() => {
      
      async function getData(){
          
          const response = await fetch('http://localhost:8080/api/myinvites', {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseProjects = await fetch('http://localhost:8080/api/projects/user/projects/' + user.id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          
          let actualData = await response.json();
          let actualDataProjects = await responseProjects.json();
          
          //console.log(actualData)
          setInvites(actualData)
          setUserProjects(actualDataProjects)
          console.log(userProjects  )
          
          setHasLoaded(true)
          //console.log(invites)
          
      }
      
      
      getData()
     }, []);
  
  
  return (
      <>
      <div>
      
      </div>
      <Row xs={3} md={3} lg={3} className="g-7">
          <div style={{width:'20%'}} className="rounded border">
              <h5>Your invites:</h5>
              <hr/>
              <div>
                  <h6>{invites.map(invite =>
                  <div key={invite.id}>
                    {invite.projectName}
                    <button onClick={acceptInvite} value={invite.id}>Accept</button>
                  </div>
              )}</h6>
              
              

              
              
              
              
              
              
              
              </div>
              
          </div>
          <div style={{width:'60%'}} className="rounded border"><h5>User's projects</h5>

          <hr/>
          {userProjects.map(userProject=>
            <div key={userProject.id}>

                {userProject.name}

            </div>
            
            
            )}
                    
                    
          
          </div>


          <div style={{width:'20%'}} className="rounded border"><h5>Your invite requests:</h5>
          <hr/>
          
          </div>
      </Row>
      </>
  )
  

  

  

  
  






}
