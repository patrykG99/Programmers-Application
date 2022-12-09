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
        <Popup open={open} contentStyle={{width:'10%', borderRadius:"10px", bottom:'45%', padding:'10px',height:'5%',backgroundColor:'#F2AA4CFF', borderColor:'black',left:'40%'}} className="rounded" position="top center">
          <div>Utworzono nowy projekt</div>
        </Popup>
        <form onSubmit={handleSubmit}>
          <div>
          <label for="name" class="form-label" style={{color:'white'}}>Project name</label>
            <div class="input-group input-group-sm mb-3">
              <input type="name"
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter name for your project"
              onChange={handleNameChange}
              value={name} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
            </div>
            <label for="desc" class="form-label" style={{color:'white'}}>Project description</label>
            <div class="input-group input-group-sm mb-3">
              <textarea  type="desc"
              id="desc"
              name="desc"
              placeholder="Describe your project idea"
              onChange={handleDescChange}
              value={desc} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
            </div>
            <label for="limit" class="form-label" style={{color:'white'}}>Maximum number of users</label>
            <select class="form-select" aria-label="Default select example"  id="limit" onChange={handleLimitChange} value={limit}>
              <option selected>Choose maximum number of users for your project</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <label for="tech" class="form-label" style={{color:'white'}}>Main language</label>
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
        
      </>
      )
    }

export default BasicForm;

