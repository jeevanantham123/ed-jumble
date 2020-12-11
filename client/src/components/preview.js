import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import '../css/preview.css';
import axios from 'axios';
import backspace from '../images/ic-backspace@3x.png';
import history from '../history';
export default class Preview extends Component {
    constructor(props){
        super(props);
        if(this.props.location.state === undefined){
            window.location = "/admin";            
        }
        this.state = {
            gameName : this.props.location.state.data.gameName,
            gameImage:this.props.location.state.data.gameImage,
            startTime: this.props.location.state.data.startTime,
            endTime: this.props.location.state.data.endTime,
            questions:this.props.location.state.data.questions,
            steps:this.props.location.state.data.steps,
            gameBgColor:this.props.location.state.data.gameBgColor,
            gameCreator:this.props.location.state.data.gameCreator,
            preview : this.props.location.state.preview
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBackSpace =  this.handleBackSpace.bind(this);

    }
    handleBackSpace(e){
        e.preventDefault();
        this.props.history.goBack();
    }
    handleSubmit(e){
        e.preventDefault();
        const game = this.props.location.state.data;
        axios.post('https://gamezonedemo.herokuapp.com/api/game/add',game)
        .then(res => {
            history.push({
                pathname :'/admin/adminPanel',
                state:{username: this.state.gameCreator}
            });
        });
    }
    render() {
        return (
            <div className ="preview">
                <form>
                <div className="back-button" onClick={this.handleBackSpace}>
                        <img src={backspace} alt="back"/>
                        &nbsp;
                        <h3 style={{marginLeft:"50px",position:"absolute"}}>Preview</h3>
                </div>
                <br/>
                <FormGroup>
                    <ControlLabel>Game Name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.gameName}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Game Creator</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.gameCreator}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Game Image</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.gameImage}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Game BgColor</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.gameBgColor}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Game Start Time</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.startTime}
                    />
                </FormGroup><FormGroup>
                    <ControlLabel>Game End Time</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.endTime}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Questions</ControlLabel>
                    <QuestionsList questions={this.state.questions}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Steps</ControlLabel>
                    <StepsList steps={this.state.steps}/>
                </FormGroup>
                {this.state.preview?
                <div className="submit">
                <Button id="success-button" className="bg-success"  bsSize="small" type="button" onClick={this.handleSubmit}>
                        Confirm
                </Button>
                </div>:
                <div></div>
                }
                </form>
            </div>
        )
    }
}

export function QuestionsList(props) {
    const questions = props.questions;
    const listItems = questions.map((que) =>
      <li key={que['id']}>
          Question:<br/><input type="text" value={que['question']}/>
          <br/>
          Answer:<br/><input type="text" value={que['answer']}/>
          <br/>
          Image:<br/><input type="text" value={que['image']}/>
          <br/>
          shuffledAnswer:<br/><input type="text" value={que['shuffledAnswer']}/>
      </li>
    );
    return (
      <div className ="q-list">
        <ul>{listItems}</ul>
      </div>
    );
  }

  export function StepsList(props){
    const steps = props.steps;
    const listItems = steps.map((step,index) =>
      <li key={index}>
        {step}
      </li>
    );
    return (
      <div className ="s-list">
        <ul>{listItems}</ul>
      </div>
    );
  }