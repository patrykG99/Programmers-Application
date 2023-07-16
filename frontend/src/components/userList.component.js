import React, {Component} from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Table from 'react-bootstrap/Table';


export default class Users extends Component {
    state = {
        users: [],
        userProjects: []
    };



    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        //console.log(user.accessToken);
        const response = await fetch('http://localhost:8080/api/users',{
            method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}
        });

        const body = await response.json();
        this.setState({users: body});

    }

    render() {
        const {users} = this.state;
        return (
            <>



                    <Row xs={5} md={5} lg={5} className="g-7" >
                       <Table className="table table-dark table-bordered mb-0" id="userTable">
                           <thead className="firstRow">
                           <tr>
                               <th scope="col">Username</th>
                               <th scope="col">Finished Projects</th>
                               <th scope="col">Most used language</th>
                           </tr>
                           </thead>
                           <tbody>
                        {users.map(user =>
                            <tr>
                                <th scope="row">{user.username}</th>
                                <td>{user.finishedProjects}</td>
                                <td>Java</td>
                            </tr>




                        )}
                           </tbody>
                       </Table>







                        {/*{users.map(user =>*/}

                        {/*    <Card id="projectCard" style={{width:'25rem', border:'solid rgba(153, 245, 39, 0.8)' }}>*/}
                        {/*        <Card.Header >{user.username}</Card.Header>*/}
                        {/*        <Card.Body>*/}
                        {/*            <Card.Title><div key={user.id}>*/}
                        {/*                Halo*/}
                        {/*            </div></Card.Title>*/}
                        {/*            <Card.Text>*/}
                        {/*                Siema<br/><br/>*/}
                        {/*            </Card.Text>*/}
                        {/*        </Card.Body>*/}
                        {/*    </Card>*/}

                        {/*)}*/}
                    </Row>





            </>
        );
    }
}