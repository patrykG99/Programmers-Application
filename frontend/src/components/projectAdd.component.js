import React, { Component, useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import axios from "axios";

import AuthService from "../services/auth.service";
const user = JSON.parse(localStorage.getItem('user'));

function BasicForm(){
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [limit, setLimit] = useState('')
    const [tech, setTech] = useState('')
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
    
    

    const handleSubmit = event => {
        event.preventDefault();
    
        const url = 'http://localhost:8080/api/projects/save'
        const requestOptions = {
            method: 'POST',
            headers: {  'Authorization':'Bearer ' + user.accessToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'name': name, 'description': desc, 'maxUsers': limit, 'tech': tech })
        };
        fetch(url, requestOptions)
            .then(response => console.log('Submitted successfully'))
            .catch(error => console.log('Form submit error', error))
            console.log(requestOptions)
      };

      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Project Name</label>
            <input
              type="name"
              name="name"
              placeholder="Enter name"
              onChange={handleNameChange}
              value={name}
            />
            <input
              type="desc"
              name="desc"
              placeholder="Description"
              onChange={handleDescChange}
              value={desc}
            />
            <select id="limit" onChange={handleLimitChange} value={limit}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
               </select>
               <select id="tech" onChange={handleTechChange} value={tech}>
                  <option value="Java">Java</option>
                  <option value="C#">C#</option>
                  <option value="Python">Python</option>
               </select>
          </div>
          <button type="submit">
            Submit
          </button>
        </form>
      )
    }

export default BasicForm;

