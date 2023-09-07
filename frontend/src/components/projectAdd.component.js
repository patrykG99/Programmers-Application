import React, { Component, useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import axios from "axios";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import AuthService from "../services/auth.service";
const user = JSON.parse(localStorage.getItem('user'));

function BasicForm(){
  
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [limit, setLimit] = useState('')
    const [tech, setTech] = useState('')
    const [open, setOpen] = useState(false);
    const handleNameChange = event => {
        setName(event.target.value)
    };
    const handleDescChange = event => {
      setDesc(event.target.value)
    };
    const handleLimitChange = event => {
      setLimit(event.target.value)
    };
    const handleTechChange = event => {
      setTech(event.target.value)
    };
    
    
    
    const closeModal = () => setOpen(false);
    const handleSubmit = event => {
        event.preventDefault();
    
        const url = 'http://localhost:8080/api/projects/save'
        const requestOptions = {
            method: 'POST',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'name': name, 'description': desc, 'maxUsers': limit, 'tech': tech })
        };
        fetch(url, requestOptions)
            .then(response => {console.log('Submitted successfully');setOpen(o => !o)})
            .catch(error => console.log('Form submit error', error))
            console.log(requestOptions)
      };

    return (
        <>
            <Popup
                open={open}
                contentStyle={{
                    width:'30%',
                    borderRadius:"10px",
                    bottom:'45%',
                    padding:'10px',
                    height:'auto',
                    backgroundColor:'#F2AA4CFF',
                    borderColor:'black',
                    left:'35%'
                }}
                className="rounded"
                position="top center"
            >
                <div>Utworzono nowy projekt</div>
            </Popup>
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#101820FF', borderRadius: '10px', color: '#F2AA4CFF' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="name" className="form-label">Project name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control input-group-sm mb-3"
                        placeholder="Enter name for your project"
                        onChange={handleNameChange}
                        value={name}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="desc" className="form-label">Project description</label>
                    <textarea
                        id="desc"
                        name="desc"
                        className="form-control input-group-sm mb-3"
                        placeholder="Describe your project idea"
                        onChange={handleDescChange}
                        value={desc}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="limit" className="form-label">Maximum number of users</label>
                    <select
                        className="form-select"
                        id="limit"
                        onChange={handleLimitChange}
                        value={limit}
                    >
                        <option value="" disabled>Choose maximum number of users for your project</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="tech" className="form-label">Main language</label>
                    <select
                        className="form-select"
                        id="tech"
                        onChange={handleTechChange}
                        value={tech}
                    >
                        <option value="" disabled>Choose main project language</option>
                        <option value="Java">Java</option>
                        <option value="C#">C#</option>
                        <option value="Python">Python</option>
                    </select>
                </div>
                <button
                    style={{
                        backgroundColor:'#F2AA4CFF',
                        color:"black",
                        float:'right',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </>
    );
    }

export default BasicForm;

