import Button from 'react-bootstrap/Button';
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import "./styles.scss"

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
        <Button variant="primary" style={{float:'right'}}>Create New Project</Button>{' '}
        </Link></div>
      <div>
        
              <h2>Projects</h2>
              <Row xs={5} md={5} lg={5} className="g-7">
              {projects.map(project =>
              
              <Card id="projectCard" style={{width:'25rem', border:'solid rgba(153, 245, 39, 0.8)' }}>
                <Card.Header style={{backgroundColor:'#101820FF', color:'white'}}>{project.tech}</Card.Header>
                <Card.Body>
                <Card.Title><div key={project.id}>
                    {project.name} 
                  </div></Card.Title>
                  <Card.Text>
                    {project.description}<br/><br/>
                    <a href={"/projects/" + project.id} class="btn btn-primary stretched-link">Go to project</a>
                  </Card.Text>
                  </Card.Body>
                  </Card>
                  
              )}
              </Row>
              
            
        
        </div>
        
        </>
    );
  }
}
