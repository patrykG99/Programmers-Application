import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
		super(props);
		this.state = {projects: []};
	}

  async componentDidMount() {
    const response = await fetch('/api/projects');
    const body = await response.json();
    this.setState({projects: body});
  }

  render() {
    const {projects} = this.state;
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="App-intro">
              <h2>Projects</h2>
              {clients.map(project =>
                  <div key={project.id}>
                    {project.name} 
                  </div>
              )}
            </div>
          </header>
        </div>
    );
  }
}
