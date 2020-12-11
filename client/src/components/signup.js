import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel , HelpBlock} from "react-bootstrap";
// import banner from '../images/banner.jpg';
import { Link } from 'react-router-dom';
import '../css/login.css'
import axios from 'axios';
import history from '../history';

export default class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            username:'',
            emailerr:'',
            passworderr:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.finalcallfunction = this.finalcallfunction.bind(this);
    }
    setEmail(value){
        this.setState({email: value});
    }
    setPassword(value){
        this.setState({password: value});
    }
    setUsername(value){
        this.setState({username: value});
    }
    validateForm() {
        return this.state.email.length > 0 && this.state.username.length > 0 && this.state.password.length >0;
      }
    handleSubmit(e){
        e.preventDefault();
        var emailformat = /[a-z0-9]+@codingmart.com/;
        var passwordformat = /[a-z0-9_]{6,}/;
        if (emailformat.test(this.state.email)){
            if(passwordformat.test(this.state.password)){
                this.setState({
                    emailerr:'',
                    passworderr:''
                });
                this.finalcallfunction();
            }
            else{
                this.setState({
                    password:''
                });
                this.setState({
                    passworderr:'Password must be atleast 6 characters!'
                });
            }
        }
        else{
            this.setState({
                email:''
            });
            this.setState({
                emailerr:'Please enter a valid email!'
            });
        }
    }
    finalcallfunction(){
        const user = {
            "username": this.state.username,
            "email":this.state.email,
            "password":this.state.password
        }
        axios.post('https://gamezonedemo.herokuapp.com/api/admin/signup',user)
        .then(res => {
            if(res.data === 'success'){
                history.push({
                    pathname:'/admin/home',
                    state:{username: this.state.username}
                })
            }
        });
    }
    render(){
        return(
            <div className="Login">
                <h3>Sign up</h3>
                <form onSubmit={this.handleSubmit}>
                   <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.username}
                        onChange={e =>this.setUsername(e.target.value)}
                        
                    />
                    </FormGroup>
                    <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="email"
                        value={this.state.email}
                        onChange={e =>this.setEmail(e.target.value)}
                    />
                    <HelpBlock>
                    <p className="text-danger">{this.state.emailerr}</p>
                    </HelpBlock>
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={this.state.password}
                        onChange={e => this.setPassword(e.target.value)}
                        type="password"
                    />
                    <HelpBlock>
                    <p className="text-danger">{this.state.passworderr}</p>
                    </HelpBlock>
                    </FormGroup>
                    <div className="signup">
                    <Button id="login-button"  bsSize="small" disabled={!this.validateForm()} type="submit">
                    Sign up
                    </Button><br/>
                    <Link to="/admin">Already a user? Log in!</Link>
                    </div>
                </form>
            </div>
        )
    }
}