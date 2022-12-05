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
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span style={{backgroundColor:'#F2AA4CFF'}} class="input-group-text" id="inputGroup-sizing-sm">Project name</span>
              </div>
              <input type="name"
              name="name"
              placeholder="Enter name for your project"
              onChange={handleNameChange}
              value={name} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span style={{backgroundColor:'#F2AA4CFF'}} class="input-group-text" id="inputGroup-sizing-sm">Project description</span>
              </div>
              <input  type="desc"
              name="desc"
              placeholder="Describe your project idea"
              onChange={handleDescChange}
              value={desc} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
            </div>
            <select class="form-select" aria-label="Default select example"  id="limit" onChange={handleLimitChange} value={limit}>
              <option selected>Choose maximum number of users for your project</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <select style={{marginTop:'15px'}} class="form-select" aria-label="Default select example" id="tech" onChange={handleTechChange} value={tech}>
              <option selected>Choose main project language</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
              <option value="Python">Python</option>
            </select>
            
               
          </div>
          <button style={{backgroundColor:'#F2AA4CFF', color:"black", float:'right',marginTop:'15px'}} className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      )
    }

export default BasicForm;

