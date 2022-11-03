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
    const handleNameChange = event => {
        setName(event.target.value)
    };
    

    const handleSubmit = event => {
        event.preventDefault();
    
        const url = 'http://localhost:8081/api/projects/save'
        const requestOptions = {
            method: 'POST',
            headers: {  'Authorization':'Bearer ' + user.accessToken },
            body: JSON.stringify({ 'name': name })
        };
        fetch(url, requestOptions)
            .then(response => console.log('Submitted successfully'))
            .catch(error => console.log('Form submit error', error))
      };

      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email address</label>
            <input
              type="name"
              name="name"
              placeholder="Enter name"
              onChange={handleNameChange}
              value={name}
            />
          </div>
          <button type="submit">
            Submit
          </button>
        </form>
      )
    }

export default BasicForm;

