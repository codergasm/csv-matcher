import React, {useEffect, useState} from 'react';
import 'react-tippy/dist/tippy.css';
import './static/style/style.css';
import axios from "axios";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoggedUserWrapper from "./components/LoggedUserWrapper";
import PublicRoutesWrapper from "./components/PublicRoutesWrapper";
import getTranslationContent from "./static/translations/getTranslationContent";
import AdminWrapper from "./components/AdminWrapper";
import {getLanguages} from "./api/languages";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";

axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.baseURL = 'http://192.168.77.31:5000';

const TranslationContext = React.createContext({});

const App = () => {
  const [content, setContent] = useState({});
  const [languages, setLanguages] = useState([]);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'pl');
  const [currency, setCurrency] = useState('PLN');

  useEffect(() => {
    getLanguages()
        .then((res) => {
          if(res?.data) {
            setLanguages(res?.data);
          }
        });
  }, []);

  useEffect(() => {
    if(lang) {
      setContent(getTranslationContent(lang));
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  useEffect(() => {
    if(lang && languages?.length) {
      const currentLanguage = languages.find((item) => {
        return item.shortcut === lang;
      });

      if(currentLanguage) {
        setCurrency(currentLanguage.currency);
      }
    }
  }, [languages, lang]);

  return <TranslationContext.Provider value={{
    content, lang, setLang, languages, currency
  }}>
    <Router>
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
      <Route path="/plany">
        <LoggedUserWrapper page={8} />
      </Route>
      <Route path="/subskrypcja">
        <LoggedUserWrapper page={9} />
      </Route>
      <Route path="/subskrypcja-przedluzona">
        <LoggedUserWrapper page={11} />
      </Route>

      {/* Admin */}
      <Route path="/admin">
        <AdminWrapper page={1} />
      </Route>
      <Route path="/transakcje">
        <AdminTransactionsPage />
      </Route>
    </Router>
  </TranslationContext.Provider>
}

export default App;
export { TranslationContext }
