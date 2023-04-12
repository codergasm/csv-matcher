import React from 'react';
import 'react-tippy/dist/tippy.css'
import './static/style/style.css';
import axios from "axios";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CorrelationPage from "./pages/CorrelationPage";
import StartPage from "./pages/StartPage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerificationPage from "./pages/VerificationPage";

axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.baseURL = 'http://192.168.77.31:5000';

const App = () => {
  return <Router>
    <Route exact path="/">
      <StartPage />
    </Route>
    <Route path="/home">
      <Homepage />
    </Route>
    <Route path="/zaloguj-sie">
      <LoginPage />
    </Route>
    <Route path="/zarejestruj-sie">
      <RegisterPage />
    </Route>
    <Route path="/weryfikacja">
      <VerificationPage />
    </Route>
    <Route path="/edytor-dopasowania">
      <CorrelationPage />
    </Route>
  </Router>
}

export default App;
