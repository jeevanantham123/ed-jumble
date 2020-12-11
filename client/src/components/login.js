import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock} from "react-bootstrap";
import '../css/login.css'
import axios from 'axios';
import {FaHome} from 'react-icons/fa';
import history from '../history';
// import banner from '../images/banner.jpg';
export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            err:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleHome = this.handleHome.bind(this);
    }
    setEmail(value){
        this.setState({email: value});
    }
    setPassword(value){
        this.setState({password: value});
    }
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
      }
    handleSubmit(e){
        e.preventDefault();
        const user = {
            "email":this.state.email,
            "password":this.state.password
        }
        axios.post('https://gamezonedemo.herokuapp.com/api/admin/login',user)
        .then(res => {
            if(res.data['status'] === "success"){
               // console.log(res.data);
                history.push({
                    pathname :'/admin/adminPanel',
                    state:{username: res.data['username']}
                });
                this.setState({err:''});
             }
            if(res.data === "failure")
             this.setState({err:'Invalid credientials'});
        })
        .catch(error => this.setState({err:'Invalid credientials'}));
    }
    handleHome(e){
        e.preventDefault();
        history.push('/');
    }
    render(){
        return(
            <div className="Login">
                <h3>Login</h3>
                <form onSubmit={this.handleSubmit}>
                    <HelpBlock>
                    <p className="text-danger">{this.state.err}</p>
                    </HelpBlock>
                    <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={e =>this.setEmail(e.target.value)}
                    />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={this.state.password}
                        onChange={e => this.setPassword(e.target.value)}
                        type="password"
                    />
                    </FormGroup>
                   
                    <div className="signup">
                    <Button id="login-button"  bsSize="large" disabled={!this.validateForm()} type="submit">
                    Login
                    </Button><br/>
                    <Link to="/admin/signup">New user? Sign up!</Link>
                     <Button id="home" type="button" onClick={this.handleHome}>Back to Home<FaHome/></Button>
                    </div>
                </form>
            </div>
        )
    }
}