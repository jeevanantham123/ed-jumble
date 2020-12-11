import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel,HelpBlock } from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import { ToastContainer, toast } from 'react-toastify';
import { HuePicker} from 'react-color'
import 'react-toastify/dist/ReactToastify.css';
import '../css/home.css';
import history from '../history';
import backspace from '../images/ic-backspace@3x.png';

export default class Home extends Component {
    constructor(props){
        super(props);
        if(this.props.location.state === undefined){
            window.location = "/admin";            
        }
        this.state = {
            gameName:'',
            gameImage:'',
            startTime: new Date(),
            endTime:new Date(),
            questions:[],
            que:{
                id:'',
                question:'',
                answer:'',
                image:'',
                shuffledAnswer:''
            },
            step:'',
            steps:[],
            gameBgColor:'',
            gameCreator:this.props.location.state.username,
            questionFormerr:'',
            imagerr:'',
            dateerr:'',
            questionImgerr:''
        };
        this.handlechangeGameName = this.handlechangeGameName.bind(this);
        this.handlechangeStartTime = this.handlechangeStartTime.bind(this);
        this.handlechangeEndTime = this.handlechangeEndTime.bind(this);
        this.handleaddQuestion = this.handleaddQuestion.bind(this);
        this.handlechangeQuestions= this.handlechangeQuestions.bind(this);
        this.handlechangeSteps = this.handlechangeSteps.bind(this);
        this.addSteps = this.addSteps.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.validateAll = this.validateAll.bind(this);
        this.handleBackSpace =  this.handleBackSpace.bind(this);

    }
    handleBackSpace(e){
        e.preventDefault();
        this.props.history.goBack();
    }
    handleChangeBgColor = (color) => {
        this.setState({ gameBgColor: color.hex });
      };
    handlechangeGameName(value){
        this.setState({
            gameName: value
        })
    }
    handlechangeGameImage(value){
        this.setState({
            gameImage: value
        })
    }
    handlechangeStartTime = date => this.setState({startTime:date});
    handlechangeEndTime = date => this.setState({endTime:date});
    handlechangeQuestions(key,val){
        var questionobj = this.state.que;
        questionobj[key] = val;
        this.setState({
            que:questionobj
        })
    }
    handleaddQuestion(){
        if(this.state.que.question && this.state.que.answer && this.state.que.image && this.state.que.shuffledAnswer){
            var imageformat = /htt+[a-z0-9_]/;
           if(imageformat.test(this.state.que.image)){
            const temp = this.state.que;
            temp.id =this.state.questions.length;
            this.setState({
                que : temp
            });
            this.state.questions.push(this.state.que);
           // console.log(this.state.questions);
            this.setState({
                questionFormerr:'',
                questionImgerr:''
            });
            toast.success("Question Added!",{
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
        else{
            this.setState({
                questionFormerr:'',
                questionImgerr:'Enter a Image Link!'
            })
        }
       }
        else{
            this.setState({
                questionFormerr:'Please fill all the fields!'
            })
        }
        const tempQue ={
            question:'',
            answer:'',
            image:'',
            shuffledAnswer:''
        }
        this.setState({
            que:tempQue
        })
    }
    handlechangeSteps(value){
            this.setState({
                step: value
            });
    }
    addSteps(){
        if(this.state.step.length > 10){
            toast.success("Step Added!",{
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            this.state.steps.push(this.state.step);
            this.setState({
                step:''
            });
        }
        else{
            toast.warn("Step must be atleast 10 chr's!",{
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
    handlePreview(e){
        e.preventDefault();
        if( this.validateForm()){
            const game = {
                "gameName"    : this.state.gameName,
                "gameImage"   : this.state.gameImage,
                "startTime"   : this.state.startTime,
                "endTime"    : this.state.endTime,
                "questions"   : this.state.questions,
                "steps"     : this.state.steps,
                "gameBgColor" :this.state.gameBgColor,
                "gameCreator" : this.state.gameCreator
            };
            history.push({
                pathname : '/admin/preview',
                state : {data : game, preview : true}
            });
        }
    }
    validateAll(){
        return  this.state.gameName.length > 0 && this.state.gameImage.length > 0 && this.state.gameBgColor.length > 0 &&  this.state.questions.length > 0 && this.state.steps.length > 0 && (this.state.endTime > this.state.startTime);
    }
    validateForm(){
        var imageformat = /htt+[a-z0-9_]/;
        if(imageformat.test(this.state.gameImage)){
           if(this.state.startTime < this.state.endTime){
                this.setState({
                    imageerr:'',
                    dateerr:''
                });
                return true;
            }
            else{
                this.setState({
                    dateerr:'End date must be greater than start date!'
                });
            }
        }
        else{
            // console.log("else");
            this.setState({
                imageerr:'Enter a image Link!'
            });
        }
    }
    render() {
        return (
            <div className="home">
                <form >
                    <div className="back-button" onClick={this.handleBackSpace}>
                        <img src={backspace} alt="back"/>
                        <h3>Add a new Game</h3>
                    </div>
                    <br/>
                   <FormGroup controlId="gamename" bsSize="large">
                    <ControlLabel>Gamename</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.gameName}
                        onChange={e =>this.handlechangeGameName(e.target.value)}
                    />
                    </FormGroup>
                    <FormGroup controlId="gameimage" bsSize="large">
                    <HelpBlock>
                    <p className="text-danger">{this.state.imageerr}</p>
                    </HelpBlock>
                    <ControlLabel>Game Banner(Enter link)</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.gameImage}
                        onChange={e =>this.handlechangeGameImage(e.target.value)}
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
                    <ControlLabel>Game BackGroundColor</ControlLabel>
                    <HuePicker
                    width='250px'
                    color={ this.state.gameBgColor }
                    onChangeComplete={ this.handleChangeBgColor }
                    />
                    </FormGroup>
                    <FormGroup controlId="starttime" bsSize="large">
                    <HelpBlock>
                    <p className="text-danger">{this.state.dateerr}</p>
                    </HelpBlock>
                    <ControlLabel>StartTime</ControlLabel>
                    <DateTimePicker
                    value = {this.state.startTime}
                    onChange={this.handlechangeStartTime}
                    />
                    </FormGroup>
                    <FormGroup controlId="endtime" bsSize="large">
                    <ControlLabel>EndTime</ControlLabel>
                    <DateTimePicker
                    value = {this.state.endTime}
                    onChange={this.handlechangeEndTime}
                    />
                    </FormGroup>
                    <FormGroup controlId="questions" bsSize="large">
                    <ControlLabel>Questions:</ControlLabel><br/>Currently Added:&nbsp;{this.state.questions.length}
                        <form className="question-form">
                            <ToastContainer />
                            <HelpBlock>
                            <p className="text-danger">{this.state.questionFormerr}</p>
                            </HelpBlock>
                            <FormGroup controlId="question" bsSize="small">
                                <p><span style={{fontSize:"17px"}}>&#8729;Question</span></p>
                                <FormControl
                                type="text"
                                value={this.state.que.question}
                                onChange={e =>this.handlechangeQuestions(e.target.id,e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup controlId="answer" bsSize="small">
                                <p><span style={{fontSize:"17px"}}>&#8729;Answer</span></p>
                                <FormControl
                                type="text"
                                value={this.state.que.answer}
                                onChange={e =>this.handlechangeQuestions(e.target.id,e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup controlId="image" bsSize="small">
                                <HelpBlock>
                                <p className="text-danger">{this.state.questionImgerr}</p>
                                </HelpBlock>
                                <p><span style={{fontSize:"17px"}}>&#8729;Image(Enter link)</span></p>
                                <FormControl
                                type="text"
                                value={this.state.que.image}
                                onChange={e =>this.handlechangeQuestions(e.target.id,e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup controlId="shuffledAnswer" bsSize="small">
                                <p><span style={{fontSize:"17px"}}>&#8729;Shuffled Answer</span></p>
                                <FormControl
                                type="text"
                                value={this.state.que.shuffledAnswer}
                                onChange={e =>this.handlechangeQuestions(e.target.id,e.target.value)}
                                />
                            </FormGroup>
                            <div className="submit">
                            <Button id="login-button" bsSize="small" type="button" onClick={this.handleaddQuestion}>
                                Add Question
                            </Button>
                            </div>
                        </form>
                    </FormGroup>
                    <FormGroup>
                    <ControlLabel>Steps:</ControlLabel><br/>
                    Currently Added: &nbsp;{this.state.steps.length}
                    <FormControl
                    type="text"
                    value={this.state.step}
                    onChange={e =>this.handlechangeSteps(e.target.value)}
                    />
                    <div className="submit" style={{marginTop:"7px"}}>
                    <Button type="button" className="bg-primary" id="success-button" onClick={this.addSteps}>Add</Button>
                    </div>
                    </FormGroup>
                    <div className="submit">
                    <Button id="login-button" bsSize="small" disabled={!this.validateAll()} type="submit" onClick={this.handlePreview}>
                        Preview
                    </Button>
                    </div>
                </form>
            </div>
        )
    }
}
