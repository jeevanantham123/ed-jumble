import React, { Component } from 'react'
import '../css/adminGames.css';
import history from '../history';
import axios from 'axios';
import BeatLoader from "react-spinners/ClipLoader";
import { jsPDF } from "jspdf";
import { Button ,FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backspace from '../images/ic-backspace@3x.png';

export default class AdminGames extends Component {
    constructor(props){
        super(props);
        if(this.props.location.state === undefined){
            window.location = "/admin";            
        }
        this.state = {
            username : this.props.location.state.username,
            games : [],
            today: new Date()
        };
        const username = this.state.username;
        axios.post('https://gamezonedemo.herokuapp.com/api/game/adminGames',{username})
        .then( res => {
            this.setState({
                games: res.data
            });
        });
        // console.log(this.state.games);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleBackSpace =  this.handleBackSpace.bind(this);
        this.handleEnable = this.handleEnable.bind(this);
        this.generate = this.generate.bind(this);
    }
    handleBackSpace(e){
        e.preventDefault();
        this.props.history.goBack();
    }
    handlePreview(game){
        history.push({
            pathname : '/admin/preview',
            state : {data : game, preview:false}
        });
    }

    generate(e,index){
        e.preventDefault();
        var doc = new jsPDF();
        var arr;
        var val =  document.getElementById(index).value;
        if(val > 0 && ((val <= this.state.games[index].winnersDetails.length) || (val <= this.state.games[index].winners.length))){
            if(this.state.games[index].winnersDetails.length > 0){
                // console.log(this.state.games[index].winnersDetails);
                arr = this.state.games[index].winnersDetails.slice(0,val);
                var emailArr = [];
                arr.forEach(ar => {
                    emailArr.push(ar.email);
                });
                doc.setFontSize(20);
                doc.text("Winners of " + this.state.games[index].gameName,10,20);
                doc.setFontSize(10);
                doc.text(emailArr, 30, 30);
                doc.save(this.state.games[index].gameName + ".pdf");
            }
            else{
                // console.log(this.state.games[index].winners);
                arr = this.state.games[index].winners.slice(0,val);
                doc.setFontSize(20);
                doc.text("Winners of " + this.state.games[index].gameName,10,20);
                doc.setFontSize(10);
                doc.text(arr, 30, 30);
                doc.save(this.state.games[index].gameName + ".pdf");
        }
        }
        else{
            toast.error("Enter a valid number!",{
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
       
    }

    handleEnable(index){
        var tempG = this.state.games;
        tempG[index].enable = !tempG[index].enable;
        this.setState({
            games:tempG
        });
        const id = this.state.games[index]._id;
        axios.post('https://gamezonedemo.herokuapp.com/api/game/enableDisable',{id})
        .then( res => {
            //console
        });
    }
    render() {
        return (
            <div className="panel">
                <div className="inner-panel">
                <h4 style={{textAlign:"center"}}>
                <div className="back-button" onClick={this.handleBackSpace}>
                    <img src={backspace} alt="back"/>
                </div>Your Games</h4>
                <ToastContainer />
                {this.state.games.length > 0 ?
                <GameBlock games={this.state.games} handlePreview={this.handlePreview} changeEnable={this.handleEnable} today = {this.state.today}
                generate = {this.generate}/>:
                <div>
                    <BeatLoader
                    size={50}
                    color={"white"}
                    loading={!this.state.isLoaded}
                    />
                </div>
                }
                </div>
            </div>
        )
    }
}

export function GameBlock(props){
    const games = props.games;
    const gamesList = [];
    const toggle = (e,index) => {
        e.preventDefault();
        props.changeEnable(index);
    };
    games.forEach((game,index) => {
        gamesList.push(
        <div id="game" key={index}>
            <div id="topper">
            <p style={{fontSize:"25px"}}>{game.gameName}
            <Button id="preview-butt" type="button" onClick={(e) => {props.handlePreview(game)}}>Preview</Button>
            </p>
            {
            game.enable?
            <Button className="bg-danger" type="button" id="endb" onClick={(e) => {toggle(e,index)}}>Disable</Button>:
            <Button className="bg-success" type="button" id="endb"  onClick={(e) => {toggle(e,index)}}>Enable</Button>
            }
            <br/>
            <br/>
            {
            (new Date(game.endTime) < props.today)?
            <div>
            <FormGroup>{    
                        game.winners.length > 0 ?
                        <ControlLabel>Winners : {game.winners.length}</ControlLabel>:
                        <ControlLabel>Winners : {game.winnersDetails.length}</ControlLabel>               
                        }
                    <FormControl
                        id = {String(index)}
                        type="number"
                        onChange = {(e) => {console.log(e.target.value)}}
                        placeholder = "select range"
                    />
            </FormGroup>
            <Button className="bg-primary" type="button" id="endb" onClick={(e) => {props.generate(e,index)}} >Generate PDF</Button>
            </div>:
            <div></div>
            }           
            </div>
            <br/>
            {
            game.winnersDetails.length > 0?
            <div id="winners">
                <h5 style={{textDecoration:"underline"}}>Winners</h5>
                <Winners winners={game.winnersDetails}/>
            </div>:
            <div></div>
            }   
        </div>
        )
    });
    return(
        <div className="games">
            {gamesList}
        </div>
    )
}

export function Winners(props){
    const winners = props.winners;
    const winnersList = [];
    winners.forEach(winner => {
        winnersList.push(
            <li key={winner.email}>{winner.email}</li>
        );
    });
    return(
        <ul style={{fontSize:"13px"}}>
            {winnersList}
        </ul>
    )
}