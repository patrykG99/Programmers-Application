import Button from 'react-bootstrap/Button';
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import ReactPaginate from 'react-paginate';


import { useState, useEffect, useMemo } from "react";
import "./styles.scss"

import { Routes, Route, Link } from "react-router-dom";


import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export default function Pages(props) {
  const [projects, setProjects] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false)
  const displayProjects = 
  useMemo(() => {

    async function getData() {

        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user.accessToken);
        const response = await fetch('http://localhost:8080/api/projects',{
          method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}
        });
        const body = await response.json();
        
        setProjects(body);
        setHasLoaded(true)

    }


    getData()
  }, []);
  
  if(hasLoaded){
  const projectsPerPage = 6
  const pageCount = Math.ceil(projects.length / projectsPerPage)
  const pagesVisited = pageNumber * projectsPerPage

    const changePage = ({selected}) =>{
        setPageNumber(selected)
    }





  console.log(projects)
  
    const displayProjects = projects.slice(pagesVisited, pagesVisited + projectsPerPage).map(project => {
        return(<>
            
            <div>
              
                    
                    
                    
                    
                    <Card id="projectCard" style={{width:'22rem' }}>
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
                        
                    
                    
                    
                  
              
              </div>
              
              </>);
    
  })
  

  return <div className='App'><h2>Projects</h2><div style={{disply:'flex', justifyContent:'left'}}>
              <Link to={"/projectAdd"} className="nav-link">
              <Button variant="primary" style={{float:'right'}}>Create New Project</Button>{' '}
              </Link></div><Row xs={3} md={3} lg={3} className="g-7">{displayProjects}</Row>
  <ReactPaginate
    previousLabel={"Previous"}
    nextLabel={"Next"}
    pageCount={pageCount}
    onPageChange={changePage}
    containerClassName={"paginationBttns"}
    previousLinkClassName={"previousBttn"}
    nextLinkClassName={"nextBttn"}
    disabledClassName={"paginationDisabled"}
    activeClassName={"paginationActive"}
  /></div>}
  
  

  
}
