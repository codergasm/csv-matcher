import React, {useEffect, useState} from 'react';
import './static/style/style.css';
import LoadFilesView from "./components/LoadFilesView";
import CorelationView from "./components/CorrelationView";

const AppContext = React.createContext(null);

const App = () => {
  const [currentView, setCurrentView] = useState(0);
  const [mainComponent, setMainComponent] = useState(<LoadFilesView />);
  const [dataSheet, setDataSheet] = useState({});
  const [relationSheet, setRelationSheet] = useState({});

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
    currentView, setCurrentView, dataSheet, setDataSheet, relationSheet, setRelationSheet
  }}>
    {mainComponent}
  </AppContext.Provider>
}

export default App;
export { AppContext }
