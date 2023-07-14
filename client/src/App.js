import React from 'react';
import 'react-tippy/dist/tippy.css';
import './static/style/style.css';
import axios from "axios";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoggedUserWrapper from "./components/LoggedUserWrapper";
import PublicRoutesWrapper from "./components/PublicRoutesWrapper";

axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.baseURL = 'http://192.168.77.31:5000';

const App = () => {
  return <Router>
    {/* Public */}
    <Route exact path="/">
      <PublicRoutesWrapper page={1} />
    </Route>
    <Route path="/zaloguj-sie">
      <PublicRoutesWrapper page={2} />
    </Route>
    <Route path="/zarejestruj-sie">
      <PublicRoutesWrapper page={3} />
    </Route>
    <Route path="/weryfikacja">
      <PublicRoutesWrapper page={4} />
    </Route>

    {/* Logged user */}
    <Route path="/home">
      <LoggedUserWrapper page={1} />
    </Route>
    <Route path="/pliki">
      <LoggedUserWrapper page={2} />
    </Route>
    <Route path="/schematy-dopasowania">
      <LoggedUserWrapper page={3} />
    </Route>
    <Route path="/edytor-dopasowania">
      <LoggedUserWrapper page={4} />
    </Route>
    <Route path="/zespol">
      <LoggedUserWrapper page={5} />
    </Route>
    <Route path="/zmien-haslo">
      <LoggedUserWrapper page={6} />
    </Route>
    <Route path="/podglad-pliku">
      <LoggedUserWrapper page={7} />
    </Route>
    <Route path="/test">

    </Route>
  </Router>
}

export default App;
