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

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(user.accessToken);
            const response = await fetch('http://localhost:8080/api/projects',{
                method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}
            });
            const body = await response.json();

            setProjects(body);
            setHasLoaded(true)
        }
        fetchData();
    }, []);

  if(hasLoaded) {
      const filteredProjects = projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const projectsPerPage = 6;
      const pageCount = Math.ceil(filteredProjects.length / projectsPerPage);
      const pagesVisited = pageNumber * projectsPerPage;

      const displayedProjects = filteredProjects
          .slice(pagesVisited, pagesVisited + projectsPerPage)
          .map(project => (
              <li key={project.id}>
                  {project.name} - {project.tech}
              </li>
          ));
      const changePage = ({ selected }) => {
          setPageNumber(selected);
      };




      console.log(projects)




      return (
          <div>
              <h2>Projects</h2>
              <input
                  type="text"
                  placeholder="Search projects"
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/projectAdd">
                  <Button variant="primary">Create New Project</Button>
              </Link>
              <ul>
                  {displayedProjects}
              </ul>
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
              />
          </div>
      );

  }

  
}
