import React from 'react';
import {authenticate, createUser} from '../actions/api.js';
import {withRouter} from 'react-router';

import '../App.css';

class LoginPageComponent extends React.Component {
  constructor() {
      super();
      this.state = {
          email: '',
          password: ''
      };
  }

  handleUsernameChange = (email) => {
      this.setState({...this.state, email: email});
  }

  handlePasswordChange = (password) => {
      this.setState({...this.state, password: password});
  }

  handleSubmit() {
    authenticate(this.state)
        .then(res => {
          if (res.data.topics.length) {
            this.props.history.push('/read');
          } else {
            this.props.history.push('/select');
          }
        });
  }

  handleSignUp = () => {
    createUser(this.state)
        .then(res => {
          if (res && res.message) {
            window.location.reload();
          }
        });
  }

  render() {
    return (
      <div className="container">
        <div className="login-card">
            <div className="login-card-content">
                <h1 className="app-name">Fool Me Thrice</h1>
                <div className="login-form">
                    <input className="form-control" onChange={(e) => this.handleUsernameChange(e.target.value)} type="text" placeholder="someone@example.com"></input>
                    <input className="form-control" onChange={(e) => this.handlePasswordChange(e.target.value)} type="password" placeholder="password123"></input>
                </div>
                <div className="mt-2 mb-2 ml-auto mr-auto">
                    <button onClick={() => this.handleSubmit()} className="login-button button btn-primary">Login</button>
                </div>
                <div className="mt-2 mb-2 ml-auto mr-auto">
                    <button onClick={() => this.handleSignUp()} className="signup-button button btn-primary">Sign Up</button>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default (withRouter)(LoginPageComponent);