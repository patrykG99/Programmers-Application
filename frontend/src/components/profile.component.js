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
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userProjects.length) : 0;

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
  const saveNewDesc = event =>{
    const url = 'http://localhost:8080/api/users/description/' + user.id
    const requestOptions = {
      method: 'PATCH',
      headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({  'description': newDesc })
  };
  
  fetch(url, requestOptions)
  console.log("dizala")
  window.location.reload(false);
  }
 
  
  
  //console.log(id)
  useEffect(() => {
      
      async function getData(){

         
        setChangeDesc(false)
          const response = await fetch('http://localhost:8080/api/myinvites', {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseProjects = await fetch('http://localhost:8080/api/projects/user/projects/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseUser = await fetch('http://localhost:8080/api/users/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseReviews = await fetch('http://localhost:8080/api/ratings/user/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});
          const responseAverageRating = await fetch('http://localhost:8080/api/ratings/average/' + id, {method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}});


          
          
          

          
          let actualData = await response.json();
          let actualDataProjects = await responseProjects.json();
          let actualDataUser = await responseUser.json();
          let actualDataReviews = await responseReviews.json();
          let actualAverage = await responseAverageRating.json();

          //console.log(actualData)
          setInvites(actualData)
          setUserProjects(actualDataProjects)
          setUserProfile(actualDataUser)
          setUserReviews(actualDataReviews)
          setAverageRating(actualAverage)
          if(actualDataUser.id == user.id){
            console.log("dziala")
          }
          console.log("halo")
          console.log(actualAverage)
          
          
          setHasLoaded(true)
          //console.log(invites)
          
      }
      
      
      getData()
     }, [id]);

     const changeNewDesc = event => {
      setNewDesc(event.target.value)
      

    
  }
  
  
  return (
    //   <>
    //
    //   <div id="userProfile" style={{height:"100%"}}>
    //   <Row lg={1}>
    // {/*  {user.id == id ? */}
    // {/*    <div style={{width:'20%',padding:'10px'}} className="rounded border" id="profile">*/}
    // {/*    <h5><b>Your invites:</b></h5>*/}
    // {/*    <hr/>*/}

    // {/*    */}
    // {/*    */}
    //
    // {/*    */}
    // {/*    */}
    // {/*    */}
    // {/*    */}
    // {/*    */}
    // {/*    */}
    // {/*    */}
    // {/*    </div>*/}
    // {/*    */}
    // {/*</div>:null}*/}
    //     <div className="border rounded" id="profile" style={{padding:'10px',width:'20%',float:'left',height:'100%'}}>
    //       <h5><b>User Information</b></h5>
    //       <hr/>
    //         <div style={{width:'20%',float:'left',height:'100%'}}><img src={"D:/programowanie/test.jpg"} alt="Zdjęcie profilowe" height="50" width="50"/></div>`
    //         <div style={{width:'80%'}}><h6><b>Username:</b></h6> {userProfile.username}<br/><br/>
    //             <h6><b>User Description:</b></h6> {userProfile.description} {userProfile.username === user.username ? <button style={{float:'right', background:'none', color:'inherit', border:'none', color:'blue'}}  onClick={changeDescValue}> Change description</button>: null}
    //             {changeDesc && <><div class="input-group input-group-sm mb-3">
    //                 <div class="input-group-prepend">
    //                     <span class="input-group-text" id="inputGroup-sizing-sm">New Description</span>
    //                 </div>
    //                 <textarea
    //                     type="newDesc"
    //                     name="newDesc"
    //                     placeholder="New Description"
    //                     onChange={changeNewDesc}
    //                     value={newDesc} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
    //                 <button className="btn btn-primary" onClick={saveNewDesc}>Save</button>
    //             </div></>}</div>
    //
    //
    //     </div>
    //   </Row>
    //   <Row xs={3} md={3} lg={3} className="g-7" style={{height:'50%'}}>
    //
    //       <div id="profile" style={{width:'80%',padding:'10px',float:'right'}}><h5><b>User's projects</b></h5></div>
    //       <div id="profile" style={{width:'80%',padding:'10px', height:'20%',overflowY: 'scroll',marginTop:"0px"}} className="rounded border"><h5></h5>
    //
    //
    //       <div style={{}}>
    //       <Table striped bordered hover variant="dark">
    //         <thead>
    //         <tr>
    //           <th>Project Name</th>
    //           <th>Your role</th>
    //           <th>Main Language</th>
    //           <th>Project Status</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         {userProjects.map(userProject=>
    //         <tr className="redirectlink" key={userProject.id} onClick={() => redirectToProject(userProject.id)}>
    //
    //             <th style={{width:'25%'}}> {userProject.name}</th>
    //             <th style={{width:'25%'}}> {userProject.owner.id == id ? <p>Owner</p>:<p>Member</p>}</th>
    //             <th style={{width:'25%'}}>{userProject.tech}</th>
    //             <th style={{width:'25%'}}>{userProject.finished ? <p>Project finished</p>:<p>Ongoing</p>}</th>
    //
    //
    //
    //
    //
    //
    //
    //
    //         </tr>
    //
    //
    //         )}
    //         </tbody>
    //       </Table>
    //       </div>
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //       </div>
    //
    //
    //
    //       <div id="profile" style={{width:'80%%',padding:'10px',height:'20%',float:'right'}} className="rounded border"><h5><b>User reviews</b></h5>
    //       <hr/>
    //       {userReviews.map(review =>
    //       <div className="rounded border" style={{padding:'10px',marginBottom:'10px'}}>
    //         {review.ratingUser.username}<br/>
    //         {review.project.name}<br/>
    //         <Rating
    //                 allowFraction="true"
    //               initialValue={review.score}
    //               readonly="true"
    //               size={20}
    //               style={{float:'right'}}
    //
    //
    //             />
    //
    //         <div style={{margin:'10px'}} >{review.comment}</div>
    //       </div>
    //
    //       )}
    //
    //       </div>
    //   </Row>
    //   </div>
    //   </>

          <div style={{width:'100%',height:'100%'}} id="userProfile">
              <h6>{invites.map(invite =>
                  <div key={invite.id}>
                      {invite.projectName}
                      <button onClick={acceptInvite} value={invite.id}>Accept</button>
                  </div>
              )}</h6>
              <div className="profileBorder" style={{height:'100%', width:'20%',float:'left'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><h4>User Information</h4><hr/></div>
                  <div className="avatar" style={{width:'80%', height:'20%', backgroundColor:'red', alignSelf:'center'}}>Avatar</div>
                  <div className="informationSection">
                      <section>
                          <h5>Username:</h5>
                          <p className="infoParagraph">{userProfile.username}</p>
                      </section>
                      <section>
                          <h5>User Description</h5>
                          <p className="infoParagraph">{userProfile.description}</p>
                      </section>
                  </div>
                  <div className="updateDesc"><hr/><a>Update Information</a></div>




              </div>
              <div className="profileBorder" style={{height:'50%', width:'60%', float:'left'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><h4>User Projects</h4><hr/>

                              {/*<ListGroup style={{width:'100%',backgroundColor:'#F2AA4CFF'}} className="custom-list-group projectList">*/}
                              {/*    <ListGroup.Item bsStyle="success" className="listHeaders">*/}
                              {/*        <div>*/}
                              {/*            <div className="userProjectsItem">Project name</div>*/}
                              {/*            <div className="userProjectsItem">Project owner</div>*/}
                              {/*            <div className="userProjectsItem">Programming language</div>*/}
                              {/*        </div>*/}
                              {/*    </ListGroup.Item>*/}

                              {/*    {userProjects.map(userProject=>*/}
                              {/*    <ListGroup.Item>*/}
                              {/*        <div className="userProjectsItem">{userProject.name}</div>*/}
                              {/*        <div className="userProjectsItem">{userProject.tech}</div>*/}
                              {/*        <div className="userProjectsItem">{userProject.tech}</div>*/}

                              {/*    </ListGroup.Item>*/}
                              {/*    )}*/}
                              {/*</ListGroup>*/}




                  </div>
                  <div className="tableContainer">
                      <Table stickyHeader >
                          <TableHead sx={{bgcolor:'#F2AA4CFF'}}>
                              <TableRow>
                                  <TableCell>Project Name</TableCell>
                                  <TableCell>Used Language</TableCell>
                                  <TableCell>Used Language</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {(rowsPerPage > 0
                                      ? userProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                      : userProjects
                              ).map((row) => (
                                  <TableRow key={row.id}>
                                      <TableCell component="th" scope="row">
                                          {row.name}
                                      </TableCell>
                                      <TableCell>{row.tech}</TableCell>
                                      <TableCell>{row.description}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                          <TableFooter>
                              <TableRow>
                                  <TablePagination
                                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                      colSpan={3}
                                      count={userProjects.length}
                                      rowsPerPage={rowsPerPage}
                                      page={page}
                                      SelectProps={{
                                          inputProps: {
                                              'aria-label': 'rows per page',
                                          },
                                          native: true,
                                      }}
                                      onPageChange={handleChangePage}
                                      onRowsPerPageChange={handleChangeRowsPerPage}
                                      ActionsComponent={TablePaginationActions}
                                  />
                              </TableRow>
                          </TableFooter>
                      </Table>
                  </div>
              </div>
              <div className="profileBorder" style={{height:'50%', width:'20%',float:'right'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><h4>User Information</h4><hr/></div>
              </div>
              <div className="profileBorder" style={{height:'50%',width:'80%', float:'right'}}>
                  <div className="sectionTitle"  style={{width:'100%', height:'10%', padding:'2px', color:'white'}}><section style={{width:'50%',float:'left'}}><h4>Ratings</h4></section><section style={{width:'50%', float:'right'}}>Average rating: {averageRating}</section></div><hr/>
                  {userReviews.map(review =>
                      <div className="rounded border" style={{padding:'10px',marginBottom:'10px', color:'white'}}>
                          {review.ratingUser.username}<br/>
                          {review.project.name}<br/>
                          <Rating
                              allowFraction="true"
                              initialValue={review.score}
                              readonly="true"
                              size={20}
                              style={{float:'right'}}


                          />

                          <div style={{margin:'10px'}} >{review.comment}</div>
                      </div>

                  )}
              </div>
          </div>

  )
  

  

  

  
  






}
