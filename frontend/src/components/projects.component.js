import Button from 'react-bootstrap/Button';
import React, { Component } from "react";

import { Routes, Route, Link } from "react-router-dom";


import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export default class Profile extends Component {
  state = {
    projects: []
  };

  

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.accessToken);
    const response = await fetch('http://localhost:8080/api/projects',{
      method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}
    });
    const body = await response.json();
    this.setState({projects: body});
    
  }
  



  render() {
    const {projects} = this.state;
    return (
      <>
      <div style={{disply:'flex', justifyContent:'left'}}>
        <Link to={"/projectAdd"} className="nav-link">
        <Button variant="primary">Add Projects</Button>{' '}
        </Link></div>
      <div>
        
              <h2>Projects</h2>
              <CardGroup>
              {projects.map(project =>
              
              <Card style={{width:'25rem'}}>
                <Card.Body>
                <Card.Title><div key={project.id}>
                    {project.name} 
                  </div></Card.Title>
                  <Card.Text>
                    Test Test
            
                  </Card.Text>
                  </Card.Body>
                  </Card>
                  
              )}
              </CardGroup>
            
        
        </div>
        </>
    );
  }
}
