import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Row from 'react-bootstrap/Row';
import {useParams, useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import { Button } from "bootstrap";
//import Table from 'react-bootstrap/Table';
import { Rating } from 'react-simple-star-rating'
import "./styles.scss"
import {Modal} from "react-bootstrap";
import {Container ,ListGroup, Col} from 'react-bootstrap';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    createTheme
} from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Card from "react-bootstrap/Card";
import PopupMenu from './updatePopup';
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#F2AA4CFF",
            },
        },
    });
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}

            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}



export default function ProjectPage(props) {
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState();
  const [userInvite, setUserInvite] = useState('')
  const [userProjects, setUserProjects] = useState([])
  const [userProfile, setUserProfile] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [changeDesc, setChangeDesc] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [averageRating, setAverageRating] = useState('')
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userProjects.length) : 0;
    const [file, setFile] = useState(null);
    const [loggedProjects, setLoggedProjects] = useState([])

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
 

  const navigate = useNavigate();


  let { id } = useParams();
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
    const redirectToProject = (project) => {
        navigate("/projects/" + project)
    }
  const changeDescValue = event => {
      setChangeDesc(current => !current)
      console.log(changeDesc)
  }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }
    const handleUploadAvatar = (event) => {

        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        // Wyślij żądanie do serwera
        axios.post(`http://localhost:8080/api/user/${user.id}/avatar`, formData,{headers:{'Authorization':'Bearer ' + user.accessToken}})
            .then((response) => {
                // Aktualizuj awatar w stanie komponentu
            });
    }

    const handleInvite = event => {
        event.preventDefault();
        const url = 'http://localhost:8080/api/invites/save/' + event.target.value
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'invitedUsername': userProfile.username, 'type': "Invite" })
        };
        fetch(url, requestOptions)
            .then(response => {console.log('Submitted successfully')})
            .catch(error => console.log('Form submit error', error))

    };

 
  
  
  //console.log(id)
  useEffect(() => {
      
      async function getData(){

         
        setChangeDesc(false)
          const response = await fetch('http://localhost:8080/api/myinvites', {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseProjects = await fetch('http://localhost:8080/api/projects/user/projects/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseUser = await fetch('http://localhost:8080/api/users/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseReviews = await fetch('http://localhost:8080/api/rating/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseAverageRating = await fetch('http://localhost:8080/api/rating/avg/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseLoggedProjects = await fetch('http://localhost:8080/api/myprojects/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});

          let actualData = await response.json();
          let actualDataProjects = await responseProjects.json();
          let actualDataUser = await responseUser.json();
          let actualDataReviews = await responseReviews.json();
          let actualAverage = await responseAverageRating.json();
          let actualLoggedProjects = await responseLoggedProjects.json()


          setInvites(actualData)
          setUserProjects(actualDataProjects)
          setUserProfile(actualDataUser)
          setUserReviews(actualDataReviews)
          setAverageRating(actualAverage)
          setLoggedProjects(actualLoggedProjects)

          console.log("Projekt")
          console.log(loggedProjects)


          
          
          setHasLoaded(true)

          
      }
      
      
      getData()
      console.log(loggedProjects)
     }, [id]);

     const changeNewDesc = event => {
      setNewDesc(event.target.value)

      

    
  }

  
  
  return (

          <div style={{width:'100%',height:'100%'}} id="userProfile">
              {/* */}

              <div className="profileBorder" style={{height:'100%', width:'20%',float:'left'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><h4>User Information</h4><hr/></div>
                  <div className="avatar" ><img src="http://localhost:8080/api/users/2/avatar"></img></div>
                  <div className="informationSection">
                      <section className={"information"}>
                          <Rating
                              allowFraction="true"
                              initialValue={averageRating}
                              readonly="true"
                              size={21}
                              style={{float:'left'}}
                          />
                      </section>
                      <section  className={"information"}>
                          <h5>Username:</h5>
                          <p className="infoParagraph">{userProfile.username}</p>
                      </section>
                      <section  className={"information"}>
                          <h5>User Description</h5>
                          <p className="infoParagraph">{userProfile.description}</p>
                      </section>
                  </div>
                  {user.id == id ? <div className="updateDesc"><PopupMenu userDescription={userProfile.description}/></div>:null}





              </div>
              <div className="profileBorder" id="projects" >
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}>
                      {user.id == id ?
                          <div><h4>User Projects</h4></div>:<div className={"titleContainer"}><h4>User Projects</h4>
                              <Dropdown className={"dropdownProjects"}>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">
                                  Invite

                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {loggedProjects.map((project, index) => (
                                      <Dropdown.Item key={index}>
                                          <div className={"project-name"} >{project.name}</div> {/* Umieść nazwę projektu w divie */}
                                          <div id="dropdownButtons"> {/* Umieść przyciski w oddzielnym divie */}
                                              <button onClick={handleInvite}  value={project.id}>Invite</button>

                                          </div>
                                      </Dropdown.Item>
                                  ))}

                              </Dropdown.Menu>
                          </Dropdown></div>
                      }






                  </div>
                  <div className="project-list">

                      <table>
                          <thead>
                          <tr>
                              <th>Nazwa Projektu</th>
                              <th>Język Programowania</th>
                          </tr>
                          </thead>
                          <tbody>
                          {userProjects.map((project, index) => (
                              <tr key={index}>
                                  <td>{project.name}</td>
                                  <td>{project.language}</td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
              </div>
              <div className="profileBorder" style={{height:'50%', width:'20%',float:'right'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><h4>User Information</h4><hr/></div>
                  <section  className={"informationSection"}>
                      <h5>Finished projects</h5>
                      <p className="infoParagraph">{userProfile.finishedProjects}</p>
                  </section>
              </div>
              <div id="reviews" className="profileBorder">
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><section style={{width:'50%',float:'left'}}><h4>Ratings</h4></section><section style={{width:'50%', float:'right'}}>Average rating: {averageRating}</section></div><hr/>
                  {userReviews.map(review =>
                      <div className="reviewCard">
                          <div id="reviewTitle" >
                              <div style={{width:'65%', float:"left"}}>{review.userRating.username}</div>
                              <Rating
                                  allowFraction="true"
                                  initialValue={review.rating}
                                  readonly="true"
                                  size={15}
                                  style={{float:'left'}}
                              />
                          </div>
                          <div id="reviewComment">{review.comment}</div>


                      </div>

                  )}
              </div>
          </div>

  )
  

  

  

  
  






}
