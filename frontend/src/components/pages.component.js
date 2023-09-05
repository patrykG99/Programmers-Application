import Button from 'react-bootstrap/Button';
import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect, useMemo } from "react";
import "./styles.scss"

import { Routes, Route, Link } from "react-router-dom";


import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

export default function Pages(props) {
  const [projects, setProjects] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false)
    const navigate = useNavigate();
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
              <tr key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className={"project-item"} >
                  <td>{project.name}</td>
                  <td>{project.tech}</td>
              </tr>
          ));
      const changePage = ({ selected }) => {
          setPageNumber(selected);
      };




      console.log(displayedProjects)




      return (
          <div className="mainList">
              <h2>Projects</h2>
              <input
                  type="text"
                  placeholder="Search projects"
                  className="filter-input"
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/projectAdd"  className="nav-link">
                  <Button className="create-project-button" variant="primary">Create New Project</Button>
              </Link>
              <table className="project-table">
                  <thead>
                  <tr>
                      <th>Name</th>
                      <th>Tech</th>
                  </tr>
                  </thead>
                  <tbody>
                  {displayedProjects}
                  </tbody>
              </table>
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
