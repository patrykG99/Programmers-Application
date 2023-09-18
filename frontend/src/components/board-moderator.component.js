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

    const removeProject = event => {
        console.log("HEHEHEHELOL")
        console.log(event.target.value)

        const url = 'http://localhost:8080/api/project/mod/' + event.target.value
        const requestOptions = {
            method: 'DELETE',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },

        };
        fetch(url, requestOptions)
        //window.location.reload(false);
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
                                        <td></td>
                                    </tr>
                                    {expandedRows.includes(group[0].project.id) &&
                                        group.map((report) => (
                                            <tr key={report.id} className="expanded-row">
                                                <td colSpan="2"></td>
                                                <td>{report.reason}</td>
                                                <td><button onClick={removeProject} value={report.project.id}>Remove</button></td>
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