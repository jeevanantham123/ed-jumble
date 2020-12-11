import React, { Component } from 'react'
import '../css/loser.css';
import history from '../history';
import {Banner} from './userhome';
import bg from '../images/wrong@3x.png';
import {Button} from 'react-bootstrap';
export default class Loser extends Component {
    constructor(props){
        super(props);
        this.state = {
            reason:this.props.location.state.failure,
            game:this.props.location.state.name
        }
       // console.log(this.props.location.state);
        this.handlePlayAgain = this.handlePlayAgain.bind(this);
        this.handelB2Home = this.handelB2Home.bind(this);
    }

    handlePlayAgain(e){
        e.preventDefault();
        this.props.history.goBack();
    }
    handelB2Home(e){
        e.preventDefault();
        history.push('/');
    }
    UNSAFE_componentWillMount(){
        if(this.props.location.state === undefined){
          //  console.log('err');
            window.location.href ="/";
        }
        if(window.localStorage.getItem(this.state.game) === null){
            window.localStorage.setItem(this.state.game,1);
        }
        else{
            var count = window.localStorage.getItem(this.state.game);
            count ++;
            window.localStorage.setItem(this.state.game,count);
        }   
    }
    render() {
        return (
            <div className="loser">
                <Banner/>
                <div className="inner-loser">
                    <div className="inner-wrong-img">
                    <img src={bg} alt=""/>
                    </div>
                    <div className="reason">
                    Oops!<br/>
                    {this.state.reason}
                    </div>
                    <div id="buttons">
                    <Button id="cq-button" type="button" onClick={this.handlePlayAgain}>Play Again</Button>
                    <Button id="cq-cancel" onClick={this.handelB2Home}>Back to Home</Button>
                    </div>
                </div>
            </div>
        )
    }
}
