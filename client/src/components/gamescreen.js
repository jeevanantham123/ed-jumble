import React, { Component } from 'react'
import '../css/gamescreen.css';
import {Button} from 'react-bootstrap';
import history from '../history';
// import {Banner} from './userhome';
import backspace from '../images/wrong@3x.png';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Timer from 'react-compound-timer';
import {FaReply} from 'react-icons/fa';
import Tick from '../images/correct@3x.png';
import quit from '../images/quit-emoji@3x.png';
import poppers from '../images/confetti-3-x.png'
import clock from '../images/clock.gif';
import $ from 'jquery';
import { fadeInUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
 
const styles = {
  fadeInUp: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeInUp, 'fadeInup')
  }
}
export default class GameScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            timer : true,
            game : this.props.location.state.game,
            id : 0,
            counterText : 'game-counter'
        };
        this.handleBackSpace = this.handleBackSpace.bind(this);
        this.handleAnswered = this.handleAnswered.bind(this);
        this.handleQuitGame = this.handleQuitGame.bind(this);
        this.handleConfrimQuit=this.handleConfrimQuit.bind(this);
        this.handleCancelQuit=this.handleCancelQuit.bind(this);
    }
    handleBackSpace(e){
        e.preventDefault();
        const confirmDiv= document.getElementById('confirm-quit');
        confirmDiv.style.display='initial';
    }
    handleAnswered(e){
        if((this.state.id+1) < this.state.game.questions.length){
            var currentQ = this.state.id;
            currentQ++;
            this.setState({
                id: currentQ,
                counterText:'question-counter',
                timer:true
            });
            this.componentDidMount();
        }
        else if((this.state.id+1) === this.state.game.questions.length){
            history.push({
                pathname:'/winner',
                state : {'winner' : true , gname: this.state.game.gameName}
            })
        }
    }
    handleQuitGame(e){
        e.preventDefault();
        this.props.history.goBack();
    }
    handleConfrimQuit(e){
        e.preventDefault();
        window.location.href = "/";
    }
    handleCancelQuit(e){
        const confirmDiv= document.getElementById('confirm-quit');
        confirmDiv.style.display='none';
    }
    componentDidMount(){
        setTimeout(() => {
            this.setState({
                timer : false
            });
            window.localStorage.setItem('startTimer',new Date().getTime());
        }, 5000);
    }
    render() {
        return (
            <div className="gameScreen">
              <StyleRoot>
                {this.state.timer ? 
                    <div className="white-screen">
                        <div className="inner-counter" >
                        <RoundCountdown text={this.state.counterText} quitgame={this.handleQuitGame}/> 
                        </div>
                    </div>
                    :
                    <div>
                    <div id="confirm-quit" style={styles.fadeInUp}>
                        <img src={quit} alt=""/>
                        <br/>
                        Are you sure?
                        <br/>
                        <Button id="cq-button" type="button" onClick={this.handleConfrimQuit}>Confirm</Button>
                        <Button id="cq=cancel" onClick={this.handleCancelQuit}>Cancel</Button>
                    </div>
                    <div id="inner-gameScreen">
                    <div className="game-main">
                        <GameArea game={this.state.game} id={this.state.id} handleAnswered={this.handleAnswered} handleBackSpace={this.handleBackSpace}/>
                    </div>
                </div>
                </div>
                }
             </StyleRoot>
            </div>
        )
    }
}


export function RoundCountdown(props){
    const text = props.text;
    if(text === 'game-counter'){
        return(
            <div>
                <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={[["#D14081"]]}
                >
                    {({ remainingTime }) =>  <span>Game will Start in<br/>{remainingTime}<br/>seconds</span>}
                </CountdownCircleTimer>
                <button id="quit-game" onClick={props.quitgame} type="button">x&nbsp; quit game</button>
            </div>
            )
    }
    if(text === 'question-counter'){
        return(
            <div style={{padding:"50px"}}>
                <p style={{color:"green"}}>Correct Answer</p>
                <img id="tick" src={Tick} alt=""/>
                <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={[["#D14081"]]}
                >
                    {({ remainingTime }) =>  <span>Next Question in<br/>{remainingTime}<br/>seconds</span>}
                </CountdownCircleTimer>
            </div>
            )
    }
    
}



export function GameArea(props){ 
    const id= props.id;
    const game = props.game;
    return(
        <div className="block">
            <div className="block-topper">
               <div className="que-num">
               <div className="gback-button" onClick={props.handleBackSpace}>
                    <img src={backspace} alt="back"/>
                    <p style={{display:"inline-block",marginLeft:"2px",fontWeight:"bold"}}>Question {id+1} of {game.questions.length}</p>
                </div>
               </div> 
            <div className="question-timer">
                <Timer
                  initialTime={20000}
                  direction="backward"  
                >
                    {() => (
                        <React.Fragment>
                            <img id="clock" src={clock} alt=""/>
                            <Timer.Seconds />s left
                        </React.Fragment>
                    )}
                </Timer>
            </div>
            </div>
            <QuestionImage image={game.questions[id].image}/>
            <Question question={game.questions[id].question}/>
            <AnswerBlock answer={game.questions[id].answer} />
            <ShuffledAnswerBlock shuffledAnswer={game.questions[id].shuffledAnswer} answer={game.questions[id].answer} answered={props.handleAnswered} gname={game.gameName}/>
        </div>
    )
}

export function Question(props){
    const question = props.question;
    return(
        <div className="question">
            {question}
        </div>
    )
} 

export function QuestionImage(props){
    const questionImage = props.image;
    return(
        <div className="questionImage">
            <img id="poppers" src={poppers} alt=""/>
            <img id="qi" src={questionImage} alt=""/>
        </div>
    )
}

export function AnswerBlock(props){
    var answer = props.answer;
    answer = answer.trim();
    const answerDivs = [];
    for (let index = 0; index < answer.length; index++) {
        const element = answer[index];
        if(element !== " "){
            if(index === 0){
                answerDivs.push(
                    <input type="text" key={index} id={index} style={{background:"rgba(81, 231, 156, 0.76)"}} className="inner-answer-div" readOnly/>
                );
            }
            else{
            answerDivs.push(
                <input type="text" key={index} id={index} className="inner-answer-div" readOnly/>
            );
            }
        }
        if(element === " "){
            answerDivs.push(
                <br key={index}/>
            );
        }
    } 
    return(
        <div className="answer">
            {answerDivs}
        </div>
    )
}


export function ShuffledAnswerBlock(props){
    
    var shuffledAnswer = props.shuffledAnswer;
    const answerdiv = document.getElementsByClassName('answer');
    var clickedCount = 0;
    shuffledAnswer = shuffledAnswer.trim();
    const answer = props.answer;
    var splitAns = answer.split(" ");
    var status = false;
    var tempAnswer = '';
    var clickedArr = [];
    var AnswerClickedArr = [];
    var checkTimer= setTimeout(() => {
        if(status){
        }
        else{
          TimeOut();
        }
    }, 20000);
    const TimeOut = () => {
        clearInterval(checkTimer);
           history.push({
                pathname:'/betterluck',
                state : {'failure' : 'seems like time out!','name':props.gname}
        });
    }
    setTimeout(() => {
        $(".inner-answer-div").click(function() {
            resetFunc($(this).attr("id"),this);
        }); 
    },500);
    const resetFunc = (id,v) => {
       if($(v).val() !== ''){
        $(v).val('');
        const sanswerdiv = document.getElementsByClassName('sanswer');
        const sElements = sanswerdiv[0].childNodes;
      //  console.log(id);
       // console.log(clickedArr[id]);
        sElements[clickedArr[id]].value = shuffledAnswer[clickedArr[id]].toUpperCase();
        AnswerClickedArr.push(Number(id));
       // answerdiv[0].childNodes[AnswerClickedArr[0]].style.background = "rgba(56, 246, 157, 0.931)";
        AnswerClickedArr.sort(function(a, b){return a - b});
     //   console.log(AnswerClickedArr);
        }
    };
    const userClicked = (e,index) => {
        if(validation() && e.target.value !== ''){
            var clickedChar = e.target.value;
            if(tempAnswer.length === splitAns[0].length){
               // console.log(tempAnswer+' '+splitAns[0]);
                tempAnswer = tempAnswer + " ";
                clickedCount++; 
                clickedArr.push("");
            }
            if(AnswerClickedArr.length > 0){
              //  console.log(AnswerClickedArr);
                  var el = AnswerClickedArr[0]; 
                //  var nl = AnswerClickedArr[1];                   
                 // console.log(tempAnswer[el]);
                 // console.log(clickedArr);
                  clickedArr[el]= index;
                  e.target.value = '';
                  answerdiv[0].childNodes[el].value = clickedChar;
                 // answerdiv[0].childNodes[nl].style.background = "rgba(56, 246, 157, 0.931)";
                  tempAnswer = tempAnswer.substr(0,el) + clickedChar + tempAnswer.substr(el+1);
                    // console.log(tempAnswer.toLowerCase()+' '+splitAns[0]);
                  AnswerClickedArr.shift();
            }
            else{
            clickedArr.push(index);
            // console.log(clickedArr);
            e.target.value = '';
            answerdiv[0].childNodes[clickedCount].value = clickedChar;
            answerdiv[0].childNodes[clickedCount].style.background = "rgb(9, 240, 132)";
            if(clickedCount+1 < shuffledAnswer.length){
                clickedCount++;
                answerdiv[0].childNodes[clickedCount].style.background = "rgba(81, 231, 156, 0.76)";
            }
            tempAnswer = tempAnswer + clickedChar;
            // console.log(tempAnswer.toLowerCase()+' '+splitAns[0]);
           }
        }
    }
    const checkAnswer = () => {
        if(tempAnswer.toLowerCase() === answer){
            props.answered();
            status = true;
            clearTimeout(checkTimer);
        }
        else{   
            clearTimeout(checkTimer);
                    history.push({
                        pathname:'/betterluck',
                        state : {'failure' : 'seems like wrong answer!' ,'name':props.gname}
                    });
        }
    }
    const validation = () => {
        if(clickedCount < shuffledAnswer.length){
            return true
        }
        else{
            return false
        }
    }
    const deletefunc = () => {
        clickedCount = 0;
        tempAnswer = '';
        clickedArr = [];
        AnswerClickedArr = [];
        const aElements = answerdiv[0].childNodes;
        const sanswerdiv = document.getElementsByClassName('sanswer');
        const sElements = sanswerdiv[0].childNodes;
        for (let index = 0; index < shuffledAnswer.length; index++) {
            const element = shuffledAnswer[index];
            aElements[index].value = '';
            aElements[index].style.background = "white";
            sElements[index].value = element.toUpperCase();
        } 
    }
    const answerDivs = [];
    for (let index = 0; index < shuffledAnswer.length; index++) {
        const element = shuffledAnswer[index];
        if(element !== " "){

        answerDivs.push(
            <input type="text"  key={index} className="inner-sanswer-div" value={element.toUpperCase()}
            onClick={(e) => {userClicked(e,index)}}  readOnly />
        );
        }
        if(element === " "){
           answerDivs.push(<br key={index}/>);
        }
        
    } 
    return(
        <div className="sanswer">
            {answerDivs}
            <br/>
            <button id="delete"  type="button"  onClick={deletefunc}>Delete<FaReply/></button>
            &nbsp;
            <button id="submit"  type="button" onClick={checkAnswer}>Submit</button>
        </div>
    )
}


/*
const s= clickedCount-1;
        //clickedCount = 0;
        // tempAnswer = '';
        const aElements = answerdiv[0].childNodes;
        const sanswerdiv = document.getElementsByClassName('sanswer');
        const sElements = sanswerdiv[0].childNodes;
        for (let index = 0; index < shuffledAnswer.length; index++) {
            const element = shuffledAnswer[index];
            aElements[index].value = '';
            sElements[index].value = element.toUpperCase();
        } 
        console.log(s);
        const ind = shuffledAnswer.indexOf(tempAnswer[s].toLowerCase());
        sElements[ind].value = aElements[s].value;
        aElements[s].value = '';
        tempAnswer = tempAnswer.slice(0,s);
        clickedCount--;
*/