import React, {Component, useEffect} from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./components/styles.scss"
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import Projects from "./components/projects.component";
import ProjectAdd from "./components/projectAdd.component"
import ProjectPage from "./components/projectPage.component"
import Pages from "./components/pages.component"
import Users from "./components/userList.component"
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown'

const user = JSON.parse(localStorage.getItem('user'));

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
          invites:[],

        };
    }





    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });



          const url = 'http://localhost:8080/api/myinvites'; // Zaktualizuj URL zgodnie z Twoim API
          console.log("HALOO2")
          fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + user.accessToken, // Jeśli wymagane jest uwierzytelnienie
            },
          })
              .then(response => response.json())
              .then(data => {
                this.setState({ invites: data });
              })
              .catch(error => {
                console.error('Wystąpił błąd podczas pobierania zaproszeń:', error);
              });


        }


    }
    acceptInvite = event => {


        const url = 'http://localhost:8080/api/invites/accept/' + event.target.value
        const requestOptions = {
            method: 'DELETE',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },

        };
        fetch(url, requestOptions)
        window.location.reload(false);
    };
    refuseInvite = event => {


        const url = 'http://localhost:8080/api/invites/refuse/' + event.target.value
        const requestOptions = {
            method: 'DELETE',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },

        };
        fetch(url, requestOptions)
        window.location.reload(false);
    };





    logOut() {
        AuthService.logout();
        this.setState({
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        });
    }


    declineInvite(){
      console.log("odrzucone")
    }
  async fetchInvites() {
    const user = this.state.currentUser;
    console.log("HALOO")

    if (user) {

    }

  }





    render() {
        const {currentUser, showModeratorBoard, showAdminBoard} = this.state;

        return (

            <div id="mainComponent">
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <div className="navbar-nav ml-auto">


                            {currentUser ? (
                                <>
                                    <Navbar.Brand href={"/profile/" + user.id}>
                                        {currentUser.username}
                                    </Navbar.Brand>
                                    <Navbar.Brand href={"/login"} onClick={this.logOut}>
                                        Log out


                                    </Navbar.Brand>
                                </>
                            ) : (
                                <>
                                    <Navbar.Brand href={"/login"}>

                                        Login

                                    </Navbar.Brand>
                                    <Navbar.Brand href={"/register"}>
                                        Sign Up
                                    </Navbar.Brand>

                                </>
                            )}
                            <Navbar.Brand href={"/pages"}>
                                Projects
                            </Navbar.Brand>
                            <Navbar.Brand href={"/users"}>
                                Users
                            </Navbar.Brand>
                            {showModeratorBoard ?
                                <Navbar.Brand href={"/modBoard"}>
                                    Moderator Board
                                </Navbar.Brand>:null
                            }

                        </div>
                        {currentUser &&
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Navbar.Brand href={"/projectAdd"} className="createProjectButton">
                                    Create Project
                                </Navbar.Brand>
                                {this.state.invites ?
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success"  className={"dropdownButton"}>
                                            Your invites <span className="invite-count">{this.state.invites.length}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {this.state.invites.map((invite, index) => (
                                                <Dropdown.Item key={index}>
                                                    <div className={"project-name"} data-title={invite.projectName} id="invitesName">{invite.projectName}</div>
                                                    <div id="invitesButtons">
                                                        <button onClick={this.acceptInvite} value={invite.id}>Accept</button>
                                                        <button onClick={this.refuseInvite} value={invite.id}>Decline</button>
                                                    </div>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    : null
                                }
                            </div>
                        }

                    </Container>
                </Navbar>

                <div className="container" style={{height: '80%'}}>
                    <Routes>
                        <Route path="/" element={<Projects/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/user" element={<BoardUser/>}/>
                        <Route path="/projects" element={<Projects/>}/>
                        <Route path="/projectAdd" element={<ProjectAdd/>}/>
                        <Route path="/projects/:id" element={<ProjectPage/>}/>
                        <Route path="/profile/:id" element={<Profile/>}/>
                        <Route path="/pages" element={<Pages/>}/>
                        <Route path="/users" element={<Users/>}/>
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;