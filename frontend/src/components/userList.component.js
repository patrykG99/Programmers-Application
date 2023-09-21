import React, { Component } from "react";
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from "react";
import "./styles.scss"



export default function Pages(props) {
    const [users, setUsers] = useState();
    const [pageNumber, setPageNumber] = useState(0);
    const [hasLoaded, setHasLoaded] = useState(false)
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState("");
    const [sortDirection, setSortDirection] = useState('asc');



    useEffect(() => {
        async function fetchData() {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(user.accessToken);
            const response = await fetch('http://localhost:8080/api/users',{
                method:'GET', headers:{"Authorization":'Bearer ' +user.accessToken}
            });
            const body = await response.json();

            setUsers(body);
            setHasLoaded(true)
        }
        fetchData();
    }, []);
    const filteredUsers = users ? users.filter(user =>
        user.username.toLowerCase().includes(searchName.toLowerCase())
    ):[]
    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            return sortDirection === 'asc'
                ? a.finishedProjects - b.finishedProjects
                : b.finishedProjects - a.finishedProjects;
        });
    }, [filteredUsers, sortDirection]);

    if(hasLoaded) {

        const usersPerPage = 6;
        const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
        const pagesVisited = pageNumber * usersPerPage;

        const displayedUsers = sortedUsers
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map(user => (
                <tr key={user.id} className={"project-item"} onClick={() => navigate(`/profile/${user.id}`)} >

                    <td>{user.username}</td>
                    <td className={"tableProjectDesc"}>{user.description}</td>
                    <td>{user.finishedProjects}</td>
                </tr>
            ));
        const changePage = ({ selected }) => {
            setPageNumber(selected);
        };


        const handleNameSearch = (e) => {
            setSearchName(e.target.value);
        };
        const toggleSortDirection = () => {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        };
        return (
            <div className="mainList">
                <div className="project-page-header">
                    <h1>Users</h1>
                </div>
                <div className="search-bar">
                    <label htmlFor="nameSearch">Search by Name: </label>
                    <input
                        type="text"
                        id="nameSearch"
                        value={searchName}
                        onChange={handleNameSearch}
                        placeholder="Search by name..."
                    />


                </div>
                <table className="project-table">
                    <thead>
                    <tr>
                        <th>Name</th>

                        <th>Description</th>
                        <th onClick={toggleSortDirection}>Finished Projects</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedUsers}
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
