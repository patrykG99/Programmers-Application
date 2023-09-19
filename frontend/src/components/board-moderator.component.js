import React, { useEffect, useState } from "react";
import 'reactjs-popup/dist/index.css';
import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem('user'));

function ModBoard() {
    const [reports, setReports] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        async function getData() {
            const responseReports = await fetch('http://localhost:8080/api/reports', {
                method: 'GET',
                headers: { "Authorization": 'Bearer ' + user.accessToken }
            });

            let actualReports = await responseReports.json();
            setReports(actualReports);
        }
        getData();
    }, []);

    const groupedReports = reports.reduce((acc, report) => {
        if (!acc[report.project.id]) {
            acc[report.project.id] = [];
        }
        acc[report.project.id].push(report);
        return acc;
    }, {});

    const handleRowClick = (projectId) => {
        setExpandedRows((prev) =>
            prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
        );
    };

    const removeProject = async (projectId) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this project?");
        if (!shouldDelete) {
            return;
        }

        try {
            const url = 'http://localhost:8080/api/project/mod/' + projectId;
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            };
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            setReports(reports.filter(report => report.project.id !== projectId));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className={"moderatorPage"}>
                <div className={"reportedProjects"}>
                    <div>
                        <table className="reports-table">
                            <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Owner</th>
                                <th>Reports Count</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.values(groupedReports).map((group, index) => (
                                <>
                                    <tr key={group[0].project.id} onClick={() => handleRowClick(group[0].project.id)}>
                                        <td>{group[0].project.name}</td>
                                        <td>{group[0].project.owner.username}</td>
                                        <td>{group.length}</td>
                                        <td><button onClick={() => removeProject(group[0].project.id)}>Remove</button></td>
                                        <td><button onClick={() => window.location.href = `/projects/${group[0].project.id}`}>Go to Project</button></td>
                                    </tr>
                                    {expandedRows.includes(group[0].project.id) &&
                                        group.map((report) => (
                                            <tr key={report.id} className="expanded-row">
                                                <td colSpan="3"></td>
                                                <td>{report.reason}</td>
                                                <td></td>
                                            </tr>
                                        ))}
                                </>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModBoard;