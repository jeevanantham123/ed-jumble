import React, { Component } from 'react'
import history from '../history';
import '../css/adminPanel.css';
import {FaUserCircle,FaSignOutAlt}  from 'react-icons/fa';
import {Button} from 'react-bootstrap';
export default class Adminpanel extends Component {
    constructor(props){
        super(props);
        if(this.props.location.state === undefined){
            window.location = "/admin";            
        }
        this.state = {
            username : this.props.location.state.username
        };
        this.handleNewGame = this.handleNewGame.bind(this);
        this.handleShowGame = this.handleShowGame.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleNewGame(e){
        e.preventDefault();
        history.push({
            pathname :'/admin/home',
            state:{username: this.state.username}
        });
    }
    handleShowGame(e){
        e.preventDefault();
        history.push({
            pathname :'/admin/adminGames',
            state:{username: this.state.username}
        });
    }
    handleLogout(e){
        e.preventDefault();
        history.push('/admin');
    }
    render() {
        return (
            <div className="panel">
                <div className="inner-panel">
                <h4 style={{textAlign:"center"}}>Admin Panel</h4>
                    <div id="buttons-logout">
                    <Button id="add-new" type="button" onClick={this.handleLogout}>Logout&nbsp;<FaSignOutAlt/></Button>
                    </div>
                    <div className="user-ico">
                        <span><FaUserCircle/>&nbsp;<p>{this.state.username}</p></span>
                    </div>
                    <div id="buttons">
                    <Button id="add-new" type="button" onClick={this.handleNewGame}>Add new Game</Button>
                    <br/>
                    <Button id="add-new" style={{marginTop:"10px"}} type="button" onClick={this.handleShowGame}>Your Games</Button>
                    </div>
                </div>
            </div>
        )
    }
}
