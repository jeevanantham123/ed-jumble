import React, { Component } from 'react'
import '../css/winner.css';
import history from '../history';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock} from "react-bootstrap";
import {Banner} from './userhome';
import bg from '../images/confetti-3-x.png';
import axios from 'axios';
export default class Winner extends Component {
    constructor(props){
        super(props);
        if(this.props.location.state === undefined){
            window.location.href ="/";
        } 
        this.state = {
            email:'',
            lsCheck:''
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChangeEmail(e){
        e.preventDefault();
        this.setState({
            email : e.target.value
        });
    }
    handleSubmit(e){
        var startTimer = window.localStorage.getItem('startTimer');
        var endTimer = window.localStorage.getItem('finishTimer');
        var diff = (endTimer-startTimer)/1000;
        e.preventDefault();
        var emailformat = /[a-z0-9]+@[a-z]+.[a-z]/;
        if(emailformat.test(this.state.email)){
            this.setState({
                err: ''
            });
            window.localStorage.setItem('email',this.state.email);
            const body = {
                email: this.state.email,
                gameDetails : {
                    gameName:this.props.location.state.gname,
                    count:window.localStorage.getItem(this.props.location.state.gname),
                    timer:diff
                }
            };
            axios.post('https://gamezonedemo.herokuapp.com/api/game/winner',body,{
                withCredentials:true
            })
            .then(res => {
                if(res.data === 'success'){
                    history.push('/');
                }
            });          
        }
        else{
            this.setState({
                err:'enter a valid email!'
            })
        }
    }
    componentWillMount(){
        window.localStorage.setItem('finishTimer',new Date().getTime());
        var startTimer = window.localStorage.getItem('startTimer');
        var endTimer = window.localStorage.getItem('finishTimer');
        var diff = (endTimer-startTimer)/1000;

        if(this.props.location.state === undefined){
            window.location.href ="/";
        } 
        if(window.localStorage.getItem(this.props.location.state.gname) === null){
            window.localStorage.setItem(this.props.location.state.gname,1);
        }
        else{
            var count = window.localStorage.getItem(this.props.location.state.gname);
            count ++;
            window.localStorage.setItem(this.props.location.state.gname,count);
        }
        if(window.localStorage.getItem('email') !== null){
            const body = {
                email: window.localStorage.getItem('email'),
                gameDetails : {
                    gameName:this.props.location.state.gname,
                    count:window.localStorage.getItem(this.props.location.state.gname),
                    timer:diff
                }
            };
            axios.post('https://gamezonedemo.herokuapp.com/api/game/winner',body,{
                withCredentials:true
            })
            .then(res => {
                if(res.data === 'success'){
                    history.push('/');
                }
            }); 
        }
    
        
    }
    render() {
        return (
            <div className="winner">
                <Banner/>
                <div className="inner-winner-block">
                    <div className="inner-winner">
                    <img src={bg} alt=""/>
                    <p id="p1">Winner!</p>
                    <br/>
                    <p id="p2">Enter your email to claim rewards!</p>
                    </div>
                    <div id="form">
                    <form>
                    <HelpBlock>
                    <p className="text-warning">{this.state.err}</p>
                    </HelpBlock>
                    <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="email"
                        value={this.state.email}
                        onChange={e => this.handleChangeEmail(e)}
                    />
                    </FormGroup>
                    <div id="submit">
                    <Button  type="button" onClick={this.handleSubmit}>
                        Submit
                    </Button>
                    </div>
                    </form>               
                    </div>
                    </div>
            </div>
        )
    }
}
