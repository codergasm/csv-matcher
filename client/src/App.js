import React, {useEffect, useState} from 'react';
import 'react-tippy/dist/tippy.css'
import './static/style/style.css';
import LoadFilesView from "./components/LoadFilesView";
import CorelationView from "./components/CorrelationView";
import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = 'http://192.168.77.31:5000';

const AppContext = React.createContext(null);

const App = () => {
  const [currentView, setCurrentView] = useState(0);
  const [mainComponent, setMainComponent] = useState(<LoadFilesView />);
  const [dataSheet, setDataSheet] = useState({});
  const [relationSheet, setRelationSheet] = useState({});
  const [dataFile, setDataFile] = useState(null);
  const [relationFile, setRelationFile] = useState(null);
  const [dataDelimiter, setDataDelimiter] = useState('');
  const [relationDelimiter, setRelationDelimiter] = useState('');

  useEffect(() => {
    switch(currentView) {
      case 0:
        setMainComponent(<LoadFilesView />);
        break;
      case 1:
        setMainComponent(<CorelationView />);
        break;
      default:
        break;
    }
  }, [currentView]);

  return <AppContext.Provider value={{
    currentView, setCurrentView,
    dataFile, setDataFile, relationFile, setRelationFile,
    dataSheet, setDataSheet, relationSheet, setRelationSheet,
    dataDelimiter, setDataDelimiter, relationDelimiter, setRelationDelimiter
  }}>
    {mainComponent}
  </AppContext.Provider>
}

export default App;
export { AppContext }
