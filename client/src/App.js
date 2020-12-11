import React from 'react';
import { Router , Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import history from './history';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/home';
import Preview from './components/preview';
import UserHome from './components/userhome';
import Startgame from './components/startgame';
import GameScreen from './components/gamescreen';
import Winner from './components/winner';
import Loser from './components/loser';
import AdminGames from './components/adminGames';
import Adminpanel from './components/adminpanel';

function App() {
  return (
    
    <Router history={history}>
      <div className="contain">
      <Route path="/" exact component={UserHome} />
      <Route path="/admin" exact component={Login} />
      <Route path="/admin/signup" exact component={Signup} />
      <Route path="/admin/home" exact component={Home} />
      <Route path="/admin/preview" exact component={Preview} />
      <Route path="/startgame" exact component={Startgame} />
      <Route path="/gamescreen" exact component={GameScreen}/>
      <Route path="/winner" exact component={Winner}/>
      <Route path="/betterluck" exact component={Loser}/>
      <Route path="/admin/adminGames" exact component={AdminGames}/>
      <Route path="/admin/adminPanel" exact component={Adminpanel}/>
      </div>
   </Router>
  );
}

export default App;
