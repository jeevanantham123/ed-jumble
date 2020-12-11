import React, { Component} from 'react'
import axios from 'axios';
import '../css/userhome.css';
import gaming from '../images/beautyPuzzle.gif';
//import comingsoon from '../images/comingsoon.gif';
import {Button} from 'react-bootstrap';
import { FaForward , FaPlayCircle, FaBackward} from 'react-icons/fa';
import history from '../history';
import BeatLoader from "react-spinners/ClipLoader";
import Countdown from 'react-countdown';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default class UserHome extends Component {
    constructor(props){
        super(props);
        window.localStorage.setItem("User Action" , true);
        this.state = {
            ComingSoonGames : [],
            OnGoingGames:[],
            FinishedGames:[],
            isLoaded: false
        };
        this.handleStartGame = this.handleStartGame.bind(this);
    }
    componentDidMount(){
        const now = new Date();
       
        const sendGetRequest = async () => {
            try{
                await axios.get('https://gamezonedemo.herokuapp.com/api/game/getGame',{
            withCredentials:true
        })
        .then( res => {
            if(res.data.games){
                for (const iterator of res.data.games) {
                    if(iterator.enable){
                    iterator.startTime = new Date(iterator.startTime);
                    iterator.endTime = new Date(iterator.endTime);
                    if(iterator.startTime > now){
                        this.state.ComingSoonGames.push(iterator);
                    }
                    else if(iterator.endTime < now){
                        this.state.FinishedGames.push(iterator);
                    }
                    else{
                        this.state.OnGoingGames.push(iterator);
                    }
                }
                }
                this.setState({
                    isLoaded : true
                });
            }
            window.localStorage.setItem('sessionID' , res.data.sessionID);
        });
            }
            catch(err){
                console.log(err);
            }
        }  
         sendGetRequest();    
    }

    handleStartGame(id){
        const game = this.state.OnGoingGames.filter((g) => {
            return g._id === id;
    });
    history.push({
        pathname:'/startgame',
        state : {game : game}
    })
    }
    render() {
        return (
            <div className="user-home">
                <Banner/>
                <div className="games-screen">
                    <b>Live Game&nbsp;<FaPlayCircle/></b>
                        {
                         this.state.isLoaded ?
                        <OnGoing games={this.state.OnGoingGames} handleStartGame = {this.handleStartGame}/>:
                        <div>
                            <BeatLoader
                            size={50}
                            color={"white"}
                            loading={!this.state.isLoaded}
                            />
                        </div>
                        }
                        <br/>
                    <b>Coming Soon&nbsp;<FaForward/></b>
                        {
                         this.state.isLoaded ?
                        <ComingSoon games={this.state.ComingSoonGames}/>:
                        <div>
                            <BeatLoader
                            size={50}
                            color={"white"}
                            loading={!this.state.isLoaded}
                            />
                        </div>
                        }
                        <br/>
                    <b>Past Games&nbsp;<FaBackward/></b>
                        {
                         this.state.isLoaded ?
                        <PastGames games={this.state.FinishedGames}/>:
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

export function ComingSoon(props){
    const games = props.games;
    const gamesList = [];
    games.forEach(game => {
        gamesList.push( 
        <div key={game._id} className="inside-element">
          <Countdown
           date={game.startTime}
           renderer = {(props)=>
           <div id="game-ending">
           <span >Starts in:&nbsp;{props.days}d {props.hours}h {props.minutes}m {props.seconds}s</span></div>}
            />
           <img src={game.gameImage} alt="not Available!"/>   
        </div>)
    });
    return(
        <Carousel className="coming-soon">
            {gamesList}
        </Carousel>
    )
}

export function OnGoing(props){
    const games = props.games;
    const gamesList = [];
    games.forEach(game => {
        gamesList.push( 
        <div key={game._id} className="inside-element" style={{padding:"5px"}}>
            <Countdown
                    date={game.endTime}
                    renderer = {(props)=> <div id="game-ending">Game Ends in: {props.days}d {props.hours}h {props.minutes}m {props.seconds}s</div>}
            />
            <img src={game.gameImage} alt="not Available!"/>
            <br/>
            <Button  id="butt" type="button" onClick={()=> props.handleStartGame(game._id)}>Play Now</Button>
        </div>)
    });
    return(
            <Carousel className="on-going">
            {gamesList}
            </Carousel>
    )
}

export function PastGames(props){
    const games = props.games;
    const gamesList = [];
    games.forEach(game => {
        gamesList.push( 
        <div key={game._id} className="inside-element">
            <h6>{game.gameName}</h6>
            <img src={game.gameImage} alt="not Available!"/>
            <br/>
        </div>)
    });
    return(
        <Carousel>
            {gamesList}
        </Carousel>
    )
}


export function Banner(props){
    return(
        <div className="banner">
            <img src={gaming} alt=""/>
        </div>
    )
}
/*
class SimpleSlider extends React.Component {
    render() {

      return (
        <Carousel>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Carousel>
      );
    }
  }*/

